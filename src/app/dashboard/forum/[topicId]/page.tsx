
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
        postsSnapshot.forEach(doc => {
            posts.push({ id: doc.id, ...doc.data() } as ForumPost);
        });

        // Serialize timestamps
        if (topic) {
            if (topic.createdAt) topic.createdAt = (topic.createdAt.toDate() as any).toISOString();
            if (topic.lastReplyAt) topic.lastReplyAt = (topic.lastReplyAt.toDate() as any).toISOString();
        }
        posts.forEach(post => {
            if (post.createdAt) post.createdAt = (post.createdAt.toDate() as any).toISOString();
        });

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
