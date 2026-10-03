import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
// @ts-ignore JS service layer
import { getUserDoc, saveLanguage, saveProfile, watchAuth } from "../services/api";
// @ts-ignore JS data module
import { normalizeResources, normalizeSkills } from "../data/onboarding";

type Role = "entrepreneur" | "mentor" | "learner";
type AppState = {
  lang: string; role: Role | null; user: any; profile: any;
  screen: string; opportunity: any; readinessScore: number | null;
  authReady: boolean;
};

const AppContext = createContext<any>(null);

const readLang = () => {
  try { return JSON.parse(localStorage.getItem("prabha-lang") || '"en"'); } catch { return "en"; }
};

/** Upgrade profiles saved by older builds ("🧵 Tailoring" → "tailoring"). */
function migrateProfile(profile: any = {}) {
  if (!profile || typeof profile !== "object") return {};
  const { ids, other } = normalizeSkills(profile.skills || []);
  return {
    ...profile,
    skills: ids,
    otherSkill: profile.otherSkill || other || "",
    resources: normalizeResources(profile.resources || []),
  };
}

export function homeFor(role: Role | null, profile: any) {
  if (role === "mentor") return "mentor-home";
  if (role === "learner") return profile?.learning ? "learning-path" : "learner-onboarding";
  return profile?.skills?.length || profile?.otherSkill ? "home" : "entrepreneur-onboarding";
}

const blank = (lang: string): AppState => ({
  lang, role: null, user: null, profile: {}, screen: "splash", opportunity: null, readinessScore: null, authReady: false,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => blank(readLang()));

  // Firebase keeps the login across reloads; restore the user's own data from Firestore.
  useEffect(() => watchAuth(async (fbUser: any) => {
    if (!fbUser) {
      setState((cur) => ({ ...cur, user: null, role: cur.user ? null : cur.role, profile: {}, authReady: true,
        screen: cur.user ? "splash" : cur.screen }));
      return;
    }
    try {
      const data = await getUserDoc(fbUser.uid);
      if (!data) { setState((cur) => ({ ...cur, authReady: true })); return; } // mid-registration
      const profile = migrateProfile(data.profile);
      setState((cur) => ({
        ...cur,
        authReady: true,
        user: { id: data.uid, name: data.name, email: data.email, role: data.role },
        role: data.role,
        profile,
        lang: data.lang || cur.lang,
        // Only redirect on cold start; don't yank the user mid-flow.
        screen: ["splash", "role", "login"].includes(cur.screen) ? homeFor(data.role, profile) : cur.screen,
      }));
    } catch (e) {
      console.error("Could not load your profile", e);
      setState((cur) => ({ ...cur, authReady: true }));
    }
  }), []);

  const update = (patch: Partial<AppState>) => {
    if ("lang" in patch && patch.lang) {
      localStorage.setItem("prabha-lang", JSON.stringify(patch.lang));
      saveLanguage(patch.lang).catch(() => {});
    }
    if ("profile" in patch && patch.profile) {
      saveProfile(patch.profile).catch((e: any) => console.error("Profile not saved", e));
    }
    setState((cur) => ({ ...cur, ...patch }));
  };

  const logout = async () => {
    try { await signOut(auth); } catch {}
    ["role", "user", "profile", "mentor-status"].forEach((k) => localStorage.removeItem(`prabha-${k}`));
    setState({ ...blank(state.lang), authReady: true });
  };

  const value = useMemo(() => ({ state, update, logout }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() { return useContext(AppContext); }
