// Learner progress, stored on the user's own private doc:
// users/{uid}.learningProgress = { done: { [lessonId]: timestamp }, quiz: { [lessonId]: correctCount } }
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export async function getLearningProgress() {
  const uid = auth.currentUser?.uid;
  if (!uid) return { done: {}, quiz: {} };
  const snap = await getDoc(doc(db, "users", uid));
  const p = snap.exists() ? snap.data().learningProgress || {} : {};
  return { done: p.done || {}, quiz: p.quiz || {} };
}

export async function saveLessonDone(lessonId, correct) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await setDoc(doc(db, "users", uid), {
    learningProgress: { done: { [lessonId]: Date.now() }, quiz: { [lessonId]: correct } },
  }, { merge: true });
}

/** Lessons finished in the last 7 days. */
export const doneThisWeek = (done = {}) => Object.values(done).filter((ts) => Date.now() - Number(ts) < 7 * 86400000).length;