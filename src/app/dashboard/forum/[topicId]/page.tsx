
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, doc, onSnapshot, orderBy, query, deleteDoc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ForumPost, ForumTopic } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/forum/post-card";
import { NewReplyForm } from "@/components/forum/new-reply-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { handleReport } from "@/lib/reports";

export default function TopicDetailPage() {
  const { topicId } = useParams();
  const router = useRouter();
  const { bandUser } = useAuth();
  const { toast } = useToast();

  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState<ForumPost | null>(null);

  useEffect(() => {
    if (typeof topicId !== "string") return;

    const topicRef = doc(db, "forumTopics", topicId);
    const unsubscribeTopic = onSnapshot(topicRef, (docSnap) => {
      if (docSnap.exists()) {
        setTopic({ id: docSnap.id, ...docSnap.data() } as ForumTopic);
      } else {
        console.error("No such topic!");
        router.push("/dashboard/forum");
      }
    });

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
  
  const canManage = useMemo(() => {
    return bandUser?.rol === "lider" || bandUser?.rol === "dirigente";
  }, [bandUser]);

  const handleDeleteClick = (post: ForumPost) => {
    setDeletingPost(post);
    setIsDeleteDialogOpen(true);
  }
  
  const onReport = async (post: ForumPost) => {
    if (!bandUser) return;
    await handleReport({
      type: 'post',
      contentId: post.id,
      contentParentId: post.topicId,
      reporterId: bandUser.id,
      reporterName: bandUser.nombreCompleto,
    });
    toast({ description: "La respuesta ha sido reportada. Gracias por tu colaboración." });
  }

  const confirmDelete = async () => {
    if (!deletingPost || typeof topicId !== "string") return;

    const postRef = doc(db, `forumTopics/${topicId}/posts`, deletingPost.id);
    const topicRef = doc(db, "forumTopics", topicId);

    try {
        await runTransaction(db, async (transaction) => {
            const topicDoc = await transaction.get(topicRef);
            if (!topicDoc.exists()) {
                throw "¡El tema no existe!";
            }

            // Delete the post
            transaction.delete(postRef);

            // Decrement reply count on topic
            const newReplyCount = Math.max(0, (topicDoc.data().replyCount || 0) - 1);
            transaction.update(topicRef, {
                replyCount: newReplyCount
            });
        });
        toast({ description: "Respuesta eliminada correctamente." });
    } catch (error) {
        toast({ variant: "destructive", description: "No se pudo eliminar la respuesta." });
        console.error("Error deleting post:", error);
    } finally {
        setIsDeleteDialogOpen(false);
        setDeletingPost(null);
    }
  }


  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!topic) {
    return null;
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

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Seguro que quieres eliminar esta respuesta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La respuesta se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard 
                    key={post.id} 
                    post={post}
                    canManage={canManage}
                    onDelete={handleDeleteClick}
                    onReport={onReport}
                />
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
