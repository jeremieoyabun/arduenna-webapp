import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { getUserProfile, updateLastLogin } from "../../lib/userService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const p = await getUserProfile(firebaseUser.uid);
          setProfile(p);
          updateLastLogin(firebaseUser.uid).catch(() => {});
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const assertAuth = () => {
    if (!auth) throw new Error("Firebase non configuré — vérifiez VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID dans Vercel.");
  };

  const login = (email, password) => { assertAuth(); return signInWithEmailAndPassword(auth, email, password); };
  const signup = (email, password) => { assertAuth(); return createUserWithEmailAndPassword(auth, email, password); };

  const loginWithGoogle = () => {
    assertAuth();
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await getUserProfile(user.uid);
      setProfile(p);
    }
  };

  // Derived values from profile for backward compatibility
  const role = profile?.role || null;
  const isAdmin = profile?.isAdmin || false;

  return (
    <AuthContext.Provider value={{
      user, profile, loading, role, isAdmin,
      login, loginWithGoogle, signup, logout,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
