

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { adminDb } from "@/lib/firebase-admin";
import type { Event } from "@/lib/types";
import { EventDetailClient } from "@/components/dashboard/event-detail-client";

export const revalidate = 0;

export async function generateStaticParams() {
    if (!adminDb) return [];
    try {
        const eventsCol = collection(adminDb, 'events');
        const eventsSnapshot = await getDocs(eventsCol);
        const events = eventsSnapshot.docs.map(doc => ({ id: doc.id }));
        return events.map((event) => ({
            id: event.id,
        }));
    } catch (error) {
        console.error("Error fetching static params for events:", error);
        return [];
    }
}

async function getEvent(id: string): Promise<Event | null> {
    if (!adminDb) return null;
    try {
        const docRef = doc(adminDb, "events", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const eventData = { id: docSnap.id, ...docSnap.data() } as Event;
            if (eventData.date && (eventData.date as any).toDate) {
                eventData.date = (eventData.date as any).toDate().toISOString();
            }
            return eventData;
        } else {
            console.error("No such event!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching event from server:", error);
        return null;
    }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

  return <EventDetailClient event={event} />;
}
