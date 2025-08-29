"use client";

import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";

import { auth, db } from "@/lib/firebase";
import type { BandUser } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  bandUser: BandUser | null;
  loading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bandUser, setBandUser] = useState<BandUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setBandUser({ id: userDoc.id, ...userDoc.data() } as BandUser);
        } else {
          // Handle case where user exists in Auth but not in Firestore
          setBandUser(null);
        }
      } else {
        setUser(null);
        setBandUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const value = { user, bandUser, loading, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
