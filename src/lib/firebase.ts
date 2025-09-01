import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "banda-b4fc5.firebaseapp.com",
  projectId: "banda-b4fc5",
  storageBucket: "banda-b4fc5.appspot.com",
  messagingSenderId: "71298040897",
  appId: "1:71298040897:web:e3ac815f127a37df4572c0",
  measurementId: "G-KWMV6PNDFT"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
