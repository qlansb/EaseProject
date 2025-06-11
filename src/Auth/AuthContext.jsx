// src/Auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // ✅ Firestore user info
  const [loading, setLoading] = useState(true);   // ✅ Wait for auth state

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            const data = snap.data();
            setUserData({
              ...data,
              role: data.role?.toLowerCase() || "", // ✅ Normalize role
            });
          } else {
            setUserData(null);
          }
        } catch (err) {
          console.error("Error fetching Firestore user:", err);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }

      setLoading(false); // ✅ End loading after checking auth
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
