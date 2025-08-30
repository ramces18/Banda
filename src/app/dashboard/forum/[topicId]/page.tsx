
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ForumPost, ForumTopic } from "@/lib/types";
import { Loader2, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/forum/post-card";
import { NewReplyForm } from "@/components/forum/new-reply-form";

export default function TopicDetailPage() {
  const { topicId } = useParams();
  const router = useRouter();

  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof topicId !== "string") return;

    // Fetch topic details
    const topicRef = doc(db, "forumTopics", topicId);
    const unsubscribeTopic = onSnapshot(topicRef, (docSnap) => {
      if (docSnap.exists()) {
        setTopic({ id: docSnap.id, ...docSnap.data() } as ForumTopic);
      } else {
        console.error("No such topic!");
        router.push("/dashboard/forum");
      }
    });

    // Fetch posts for the topic
    const postsQuery = query(collection(db, `forumTopics/${topicId}/posts`), orderBy("createdAt", "asc"));
    const unsubscribePosts = onSnapshot(postsQuery, (querySnapshot) => {
      const postsData: ForumPost[] = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as ForumPost);
      });
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
    });

    return () => {
      unsubscribeTopic();
      unsubscribePosts();
    };
  }, [topicId, router]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!topic) {
    return null; // or a not found component
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div>
            <Button asChild variant="outline" size="sm" className="mb-4">
                <Link href="/dashboard/forum">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Foro
                </Link>
            </Button>

            <h1 className="text-3xl font-bold tracking-tight">{topic.title}</h1>
            <p className="text-sm text-muted-foreground">
                Iniciado por {topic.authorName}
            </p>
       </div>

        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
        
        {posts.length === 0 && !loading && (
             <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Sin respuestas</h3>
                <p className="mt-1 text-sm text-muted-foreground">Sé el primero en responder a este tema.</p>
            </div>
        )}

       <NewReplyForm topicId={topicId as string} />

    </div>
  );
}
