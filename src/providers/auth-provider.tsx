
"use client";

import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (user) {
          // Primero, seteamos el usuario de Auth
          setUser(user);
          // Luego, buscamos el documento en Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setBandUser({ id: userDoc.id, ...userDoc.data() } as BandUser);
             if (pathname === '/login' || pathname === '/') {
                router.replace('/dashboard/home');
            }
          } else {
            console.warn(`No user document found in Firestore for UID: ${user.uid}`);
            setBandUser(null);
            // Si no se encuentra doc, cerramos sesión para evitar bucles
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
      router.push("/");
    } catch (error) {
       console.error("Error signing out: ", error);
    }
  };

  const value = { user, bandUser, loading, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
