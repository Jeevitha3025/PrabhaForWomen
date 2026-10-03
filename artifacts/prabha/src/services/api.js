import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../lib/firebase";
import { domainsForProfile, skillLabels } from "../data/onboarding";
import { buildRoadmap, rankOpportunities, whyFits } from "../data/roadmaps";
import { SCHEMES } from "../data/schemes";

export const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");

/*
 * Firestore layout
 * ─────────────────
 * users/{uid}      private – only the owner can read/write
 *   { uid, name, email, role, lang, profile, roadmapProgress, mentorPrivate, createdAt, updatedAt }
 * mentors/{uid}    public mentor card – readable when approved
 *   { uid, name, domains, spoken, years, modes, verificationStatus, submittedAt, updatedAt }
 *   → verificationStatus is changed BY HAND in the Firebase console
 * requests/{id}    entrepreneur → mentor session requests
 *   { mentorId, mentorName, entrepreneurId, entrepreneurName, village, skills, slot, mode, status, createdAt }
 */

const uidOrThrow = () => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Please sign in again.");
  return uid;
};

// ─── 1. AUTH + USER STORAGE ──────────────────────────────────────────────────

export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserDoc(uid = auth.currentUser?.uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

const toAppUser = (data) => ({ id: data.uid, name: data.name, email: data.email, role: data.role });

export async function registerUser({ name, email, password, role, lang }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  const data = { uid: cred.user.uid, name, email, role, lang: lang || "en", profile: {}, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  await setDoc(doc(db, "users", cred.user.uid), data);
  return { user: toAppUser(data), profile: {}, isNew: true };
}

export async function loginUser({ email, password, role, lang }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  let data = await getUserDoc(cred.user.uid);
  if (!data) {
    // Auth account exists but the Firestore doc was never written (older builds).
    data = { uid: cred.user.uid, name: cred.user.displayName || email.split("@")[0], email, role, lang: lang || "en", profile: {}, createdAt: serverTimestamp() };
    await setDoc(doc(db, "users", cred.user.uid), { ...data, updatedAt: serverTimestamp() });
  }
  return { user: toAppUser(data), profile: data.profile || {}, isNew: false };
}

export async function saveProfile(profile) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await setDoc(doc(db, "users", uid), { profile, updatedAt: serverTimestamp() }, { merge: true });
}

export async function saveLanguage(lang) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await setDoc(doc(db, "users", uid), { lang }, { merge: true });
}

// ─── 2. MENTOR VERIFICATION ──────────────────────────────────────────────────
// Approve a mentor: Firebase console → Firestore → mentors → {uid}
// → change verificationStatus "pending" → "approved" (or "rejected").
// The app updates instantly through listenMentorStatus().

export async function submitMentorDocuments(files, mentor) {
  const uid = uidOrThrow();

  const docPaths = await Promise.all(
    Array.from(files).map(async (file) => {
      const safeName = `${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const fileRef = ref(storage, `mentor-docs/${uid}/${safeName}`);
      await uploadBytes(fileRef, file, { contentType: file.type });
      return fileRef.fullPath;
    })
  );

  // Private part (documents) stays on the user's own doc.
  await setDoc(doc(db, "users", uid), {
    name: mentor.name,
    mentorPrivate: { docPaths, submittedAt: serverTimestamp() },
    updatedAt: serverTimestamp(),
  }, { merge: true });

  // Public mentor card – always (re)submitted as pending.
  await setDoc(doc(db, "mentors", uid), {
    uid,
    name: mentor.name,
    domains: mentor.domains,
    spoken: mentor.spoken,
    years: mentor.years,
    modes: mentor.modes,
    verificationStatus: "pending",
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  // Confirmation email – failure must not block the mentor.
  const emailSent = await notifyMentorSubmitted({ ...mentor, docCount: docPaths.length }).catch(() => false);
  return { status: "pending", emailSent };
}

async function notifyMentorSubmitted(mentor) {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(`${API_BASE}/api/mentor/submitted`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: mentor.name, domains: mentor.domains, years: mentor.years, docCount: mentor.docCount }),
  });
  return res.ok;
}

/** Real-time status. Returns the unsubscribe function. */
export function listenMentorStatus(callback) {
  const uid = auth.currentUser?.uid;
  if (!uid) { callback("none"); return () => {}; }
  return onSnapshot(
    doc(db, "mentors", uid),
    (snap) => callback(snap.exists() ? snap.data().verificationStatus || "pending" : "none"),
    () => callback("pending"),
  );
}

// ─── 3. MENTOR MATCHING ──────────────────────────────────────────────────────

const LANG_LABEL = { en: "English", hi: "Hindi", kn: "Kannada" };

const SAMPLE_MENTORS = [
  { id: "sample-meena",  avatar: "👩🏽‍🌾", name: "Meena K.",  domains: ["Textiles", "Craft"],     spoken: ["kn", "en"], years: 8,  modes: ["Phone", "Video"],      isSample: true },
  { id: "sample-sunita", avatar: "👩🏽‍🍳", name: "Sunita V.", domains: ["Food", "Finance"],       spoken: ["hi", "en"], years: 15, modes: ["Phone", "In-Person"],  isSample: true },
  { id: "sample-asha",   avatar: "👩🏽‍🔬", name: "Asha P.",   domains: ["Health", "Agri"],        spoken: ["hi", "kn"], years: 10, modes: ["Chat", "Phone"],       isSample: true },
  { id: "sample-kavita", avatar: "👩🏽‍💻", name: "Kavita S.", domains: ["Digital", "Education"],  spoken: ["en", "kn"], years: 6,  modes: ["Video", "Chat"],       isSample: true },
  { id: "sample-deepa",  avatar: "💇🏽‍♀️", name: "Deepa R.",  domains: ["Beauty", "Finance"],     spoken: ["kn", "hi"], years: 12, modes: ["In-Person", "Phone"],  isSample: true },
];

function scoreMentor(mentor, { domains, lang, prefersVoice, focusDomain }) {
  const reasons = [];
  let score = 0;
  const overlap = (mentor.domains || []).filter((d) => domains.includes(d));
  if (overlap.length) { score += overlap.length * 4; reasons.push(`Knows ${overlap.join(" & ")}`); }
  if (focusDomain && (mentor.domains || []).includes(focusDomain)) score += 4;
  if ((mentor.spoken || []).includes(lang)) { score += 3; reasons.push(`Speaks ${LANG_LABEL[lang] || lang}`); }
  if (prefersVoice && (mentor.modes || []).some((m) => ["Phone", "Video", "In-Person"].includes(m))) { score += 1; reasons.push("Offers calls"); }
  score += Math.min(mentor.years || 0, 15) / 5;
  return { ...mentor, matchScore: Math.round(score * 10) / 10, reasons };
}

const toCard = (m) => ({
  ...m,
  avatar: m.avatar || "👩🏽",
  domainText: (m.domains || []).join(" · "),
  languageText: (m.spoken || []).map((c) => LANG_LABEL[c] || c).join(" · "),
  slots: m.slots || ["09:30", "12:00", "17:30"],
});

/**
 * @param profile entrepreneur profile
 * @param opts { lang, focusDomain } focusDomain = the opportunity being explored
 */
export async function getMentorsForUser(profile = {}, opts = {}) {
  const ctx = {
    domains: domainsForProfile(profile),
    lang: opts.lang || "en",
    prefersVoice: profile.literacy === "voice",
    focusDomain: opts.focusDomain,
  };
  let mentors = [];
  try {
    const snap = await getDocs(query(collection(db, "mentors"), where("verificationStatus", "==", "approved")));
    mentors = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((m) => m.id !== auth.currentUser?.uid);
  } catch (e) {
    console.warn("Mentor query failed, using samples", e);
  }
  if (!mentors.length) mentors = SAMPLE_MENTORS;
  return mentors.map((m) => toCard(scoreMentor(m, ctx))).sort((a, b) => b.matchScore - a.matchScore);
}

// ─── 4. SESSION REQUESTS (entrepreneur ⇄ mentor) ─────────────────────────────

export async function bookMentorSlot(mentor, { date, time, mode }, me = {}) {
  const slot = `${date} · ${time}`;
  if (mentor.isSample) return { id: `sample-${Date.now()}`, status: "requested", sample: true };
  const uid = uidOrThrow();
  const ref_ = await addDoc(collection(db, "requests"), {
    mentorId: mentor.id,
    mentorName: mentor.name,
    entrepreneurId: uid,
    entrepreneurName: me.name || "",
    entrepreneurEmail: auth.currentUser?.email || "",
    village: me.profile?.location || "",
    skills: skillLabels(me.profile).join(", "),
    date,
    time,
    slot,
    mode,
    status: "requested",
    createdAt: serverTimestamp(),
  });
  return { id: ref_.id, status: "requested" };
}

/** Entrepreneur: her own session requests, live. */
export function listenMyRequests(callback) {
  const uid = auth.currentUser?.uid;
  if (!uid) { callback([]); return () => {}; }
  return onSnapshot(
    query(collection(db, "requests"), where("entrepreneurId", "==", uid)),
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    () => callback([]),
  );
}

export function listenMentorRequests(callback) {
  const uid = auth.currentUser?.uid;
  if (!uid) { callback([]); return () => {}; }
  return onSnapshot(
    query(collection(db, "requests"), where("mentorId", "==", uid)),
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    () => callback([]),
  );
}

/** extra = { calendarEventId, calendarLink, meetLink } when a calendar event was created */
export async function respondToRequest(id, status, extra = {}) {
  await updateDoc(doc(db, "requests", id), { status, ...extra, respondedAt: serverTimestamp() });
}

/** Remember (per mentor) that she connected Google Calendar, so the app can auto-add events. */
export async function setCalendarConnected(connected) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await setDoc(doc(db, "users", uid), { calendarConnected: Boolean(connected) }, { merge: true });
}

// ─── 5. OPPORTUNITIES + PERSONALISED ROADMAPS ────────────────────────────────

export async function getOpportunities(profile = {}) {
  return rankOpportunities(profile).map((o, i) => ({ ...o, rank: i + 1, whyFits: whyFits(o, profile) }));
}

export function getRoadmap(opportunity, profile) {
  return buildRoadmap(opportunity, profile);
}

export async function getRoadmapProgress(oppId) {
  const data = await getUserDoc().catch(() => null);
  return data?.roadmapProgress?.[oppId] || [];
}

export async function saveRoadmapProgress(oppId, doneIds) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await setDoc(doc(db, "users", uid), { roadmapProgress: { [oppId]: doneIds } }, { merge: true });
}

// ─── Unchanged mocks ─────────────────────────────────────────────────────────

export async function submitReadiness(answers) {
  return { score: answers.reduce((s, a) => s + Number(a || 0), 0) };
}

export async function getChatReply(message, history = [], lang = "en", profile = {}) {
  try {
    const response = await fetch(`${API_BASE}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, language: lang, profile }),
    });
    if (!response.ok) throw new Error(`Yojana Mitra API error: ${response.status}`);
    const data = await response.json();
    return typeof data.answer === "string" ? data.answer : "I could not find an answer. Please try asking differently.";
  } catch (error) {
    console.error("Yojana Mitra error:", error);
    return "I couldn't reach Yojana Mitra right now. Please try again in a minute.";
  }
}
export async function getSpeechAudio(text, lang = "kn") {
  try {
    const languageCode =
      lang === "kn" ? "kn-IN" :
      lang === "hi" ? "hi-IN" :
      "en-IN";

      console.log("TTS request:", {
  text,
  lang,
  languageCode,
});
    const response = await fetch(`${API_BASE}/api/voice/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        languageCode,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.details || `TTS API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.audioBase64) {
      throw new Error("No audio returned from TTS API");
    }

    return data;
  } catch (error) {
    console.error("Sarvam TTS error:", error);
    throw error;
  }
}
export async function getSchemes() {
  return SCHEMES;
}

// ─── Scheme application tracker (users/{uid}.schemeTracker.{schemeId}) ──────
// { stage, docsDone: [index], stepsDone: [index], refNo, appliedOn, notes, updatedAt }

export async function getSchemeTracker() {
  const data = await getUserDoc().catch(() => null);
  return data?.schemeTracker || {};
}

export async function saveSchemeTracker(schemeId, entry) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await setDoc(doc(db, "users", uid), { schemeTracker: { [schemeId]: { ...entry, updatedAt: Date.now() } } }, { merge: true });
}

export async function getLearnerCourses() {
  return [
    { emoji: "🧵", title: "Start with your skill",    duration: 18 },
    { emoji: "💰", title: "Price your first product", duration: 24 },
    { emoji: "📱", title: "Find your first customer", duration: 16 },
  ];
}