
"use client";

import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, useEffect, useState, useCallback } from "react";

import { auth, db } from "@/lib/firebase";
import type { BandUser } from "@/lib/types";
import { initializeFirebaseMessaging } from "@/lib/firebase-messaging";

interface AuthContextType {
  user: User | null;
  bandUser: BandUser | null;
  loading: boolean;
  logout: () => void;
  setBandUser: React.Dispatch<React.SetStateAction<BandUser | null>>; // Expose setBandUser
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bandUser, setBandUser] = useState<BandUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (user) {
          setUser(user);
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setBandUser({ id: userDoc.id, ...userDoc.data() } as BandUser);
             if (pathname === '/login' || pathname === '/') {
                router.replace('/dashboard/home');
            }
            // Initialize messaging and get token
            initializeFirebaseMessaging(user.uid);
          } else {
            console.warn(`No user document found in Firestore for UID: ${user.uid}`);
            setBandUser(null);
            await signOut(auth);
          }
        } else {
          setUser(null);
          setBandUser(null);
          if (pathname.startsWith('/dashboard')) {
            router.replace('/login');
          }
        }
      } catch (error) {
        console.error("Error in AuthProvider:", error);
        setUser(null);
        setBandUser(null);
        if (pathname.startsWith('/dashboard')) {
            router.replace('/login');
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const logout = async () => {
    try {
      await signOut(auth);
      // Reset state immediately
      setUser(null);
      setBandUser(null);
      router.push("/");
    } catch (error) {
       console.error("Error signing out: ", error);
    }
  };

  const value = { user, bandUser, loading, logout, setBandUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
