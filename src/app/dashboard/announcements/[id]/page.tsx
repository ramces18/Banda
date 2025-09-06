

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { adminDb } from "@/lib/firebase-admin";
import type { Announcement, BandUser } from "@/lib/types";
import { AnnouncementDetailClient } from "@/components/dashboard/announcement-detail-client";

export const revalidate = 0;

export async function generateStaticParams() {
  if (!adminDb) return [];
  try {
    const announcementsCol = collection(adminDb, 'announcements');
    const announcementsSnapshot = await getDocs(announcementsCol);
    const announcements = announcementsSnapshot.docs.map(doc => ({ id: doc.id }));
    return announcements.map((announcement) => ({
      id: announcement.id,
    }));
  } catch (error) {
    console.error("Error fetching static params for announcements:", error);
    return [];
  }
}

async function getAnnouncement(id: string): Promise<Announcement | null> {
    if (!adminDb) return null;
    try {
        const docRef = doc(adminDb, "announcements", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const announcementData: Announcement = { id: docSnap.id, ...data } as Announcement;
            
            if (data.autor) {
                const authorDoc = await getDoc(doc(adminDb, "users", data.autor));
                if (authorDoc.exists()) {
                    announcementData.autorNombre = (authorDoc.data() as BandUser).nombreCompleto;
                }
            }
            // Firestore timestamps need to be converted to a serializable format for the client
            if (announcementData.fecha && (announcementData.fecha as any).toDate) {
              announcementData.fecha = (announcementData.fecha as any).toDate().toISOString();
            }
            return announcementData;
        } else {
            console.error("No such announcement!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching announcement from server:", error);
        return null;
    }
}

// Apply the correct type to the page component
export default async function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  const announcement = await getAnnouncement(params.id);

  return <AnnouncementDetailClient announcement={announcement} />;
}
