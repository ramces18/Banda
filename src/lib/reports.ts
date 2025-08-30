
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { Report } from "./types";

// This is a helper function to be called from client components
// to abstract away the Firestore logic for reporting content.

type ReportInput = Omit<Report, 'id' | 'reportedAt'>;

export const handleReport = async (reportData: ReportInput) => {
  try {
    const reportWithTimestamp = {
      ...reportData,
      reportedAt: serverTimestamp(),
    };
    await addDoc(collection(db, "reports"), reportWithTimestamp);
    console.log("Content reported successfully");
  } catch (error) {
    console.error("Error reporting content:", error);
    // Optionally, rethrow or handle the error in the UI
    throw error;
  }
};
