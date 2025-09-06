

import { collection, doc, getDocs, orderBy, query, getDoc } from "firebase/firestore";
import { adminDb } from "@/lib/firebase-admin";
import type { ForumPost, ForumTopic } from "@/lib/types";
import { TopicDetailClient } from "@/components/forum/topic-detail-client";

export const revalidate = 0;

export async function generateStaticParams() {
    if (!adminDb) return [];
    try {
        const topicsCol = collection(adminDb, 'forumTopics');
        const topicsSnapshot = await getDocs(topicsCol);
        const topics = topicsSnapshot.docs.map(doc => ({ id: doc.id }));
        return topics.map((topic) => ({
            topicId: topic.id,
        }));
    } catch (error) {
        console.error("Error fetching static params for forum topics:", error);
        return [];
    }
}

async function getTopicData(topicId: string) {
    if (!adminDb) return { topic: null, posts: [] };
    try {
        const topicRef = doc(adminDb, "forumTopics", topicId);
        const topicSnap = await getDoc(topicRef);
        const topic = topicSnap.exists() ? { id: topicSnap.id, ...topicSnap.data() } as ForumTopic : null;

        const postsQuery = query(collection(adminDb, `forumTopics/${topicId}/posts`), orderBy("createdAt", "asc"));
        const postsSnapshot = await getDocs(postsQuery);
        const posts: ForumPost[] = [];
        for (const postDoc of postsSnapshot.docs) {
           const postData = { id: postDoc.id, ...postDoc.data() } as ForumPost;
           
           if (postData.createdAt && (postData.createdAt as any).toDate) {
               postData.createdAt = (postData.createdAt as any).toDate().toISOString();
           }
           posts.push(postData);
        }

        // Serialize timestamps for topic
        if (topic) {
            if (topic.createdAt && (topic.createdAt as any).toDate) {
                topic.createdAt = (topic.createdAt as any).toDate().toISOString();
            }
            if (topic.lastReplyAt && (topic.lastReplyAt as any).toDate) {
                topic.lastReplyAt = (topic.lastReplyAt as any).toDate().toISOString();
            }
        }

        return { topic, posts };

    } catch (error) {
        console.error("Error fetching topic data from server:", error);
        return { topic: null, posts: [] };
    }
}


export default async function TopicDetailPage({ params }: { params: { topicId: string } }) {
    const { topic, posts } = await getTopicData(params.topicId);
    
    return <TopicDetailClient initialTopic={topic} initialPosts={posts} />;
}
