import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Create a user profile in Firestore on signup.
 */
export async function createUserProfile(uid, data) {
  if (!db) return;
  const ref = doc(db, "users", uid);
  await setDoc(ref, {
    uid,
    email: data.email || "",
    displayName: data.displayName || "",
    firstName: data.firstName || "",
    role: data.role || "bartender",
    lang: data.lang || "fr",
    avatarUrl: data.avatarUrl || null,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    onboardingCompleted: false,
    isAdmin: false,
  });
}

/**
 * Get a user profile from Firestore.
 * Returns null if not found or Firestore unavailable.
 */
export async function getUserProfile(uid) {
  if (!db) return null;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/**
 * Update specific fields on a user profile.
 */
export async function updateUserProfile(uid, data) {
  if (!db) return;
  const ref = doc(db, "users", uid);
  await updateDoc(ref, data);
}

/**
 * Update lastLoginAt timestamp.
 */
export async function updateLastLogin(uid) {
  if (!db) return;
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { lastLoginAt: serverTimestamp() });
}
