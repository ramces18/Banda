
"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, writeBatch, doc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ForumTopic } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, Loader2, Trash2, Flag } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewTopicForm } from "@/components/forum/new-topic-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { handleReport } from "@/lib/reports";

export default function ForumPage() {
  const { bandUser } = useAuth();
  const { toast } = useToast();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingTopic, setDeletingTopic] = useState<ForumTopic | null>(null);

  useEffect(() => {
    const q = query(collection(db, "forumTopics"), orderBy("lastReplyAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const topicsData: ForumTopic[] = [];
      querySnapshot.forEach((doc) => {
        topicsData.push({ id: doc.id, ...doc.data() } as ForumTopic);
      });
      setTopics(topicsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching forum topics:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const canManage = useMemo(() => {
    return bandUser?.rol === "lider" || bandUser?.rol === "dirigente";
  }, [bandUser]);

  const handleDeleteClick = (topic: ForumTopic) => {
    setDeletingTopic(topic);
    setIsDeleteDialogOpen(true);
  }

  const confirmDelete = async () => {
    if (!deletingTopic) return;
    try {
      const batch = writeBatch(db);

      // 1. Delete all posts in the subcollection
      const postsQuery = query(collection(db, `forumTopics/${deletingTopic.id}/posts`));
      const postsSnapshot = await getDocs(postsQuery);
      postsSnapshot.forEach(postDoc => {
        batch.delete(postDoc.ref);
      });

      // 2. Delete the topic itself
      const topicRef = doc(db, "forumTopics", deletingTopic.id);
      batch.delete(topicRef);

      await batch.commit();
      
      toast({ description: "Tema eliminado correctamente." });
    } catch (error) {
      toast({ variant: "destructive", description: "No se pudo eliminar el tema." });
      console.error("Error deleting topic:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingTopic(null);
    }
  }
  
  const onReport = async (topicId: string) => {
    if (!bandUser) return;
    await handleReport({
      type: 'topic',
      contentId: topicId,
      reporterId: bandUser.id,
      reporterName: bandUser.nombreCompleto,
    });
    toast({ description: "El tema ha sido reportado. Gracias por tu colaboración." });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Nuevo Tema
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Iniciar una nueva discusión</DialogTitle>
                    <DialogDescription>
                        Crea un nuevo tema para que otros miembros puedan participar.
                    </DialogDescription>
                </DialogHeader>
                <NewTopicForm onFinished={() => setIsFormOpen(false)} />
            </DialogContent>
        </Dialog>
      </div>

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Seguro que quieres eliminar este tema?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el tema y todas sus respuestas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : topics.length > 0 ? (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Tema</TableHead>
                    <TableHead className="hidden sm:table-cell text-center">Respuestas</TableHead>
                    <TableHead className="hidden sm:table-cell text-right">Última Actividad</TableHead>
                     <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topics.map((topic) => (
                    <TableRow key={topic.id}>
                        <TableCell>
                            <Link href={`/dashboard/forum/${topic.id}`} className="font-medium hover:underline">
                                {topic.title}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                Iniciado por {topic.authorName}
                            </p>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-center">{topic.replyCount}</TableCell>
                        <TableCell className="hidden sm:table-cell text-right">
                             {topic.lastReplyAt ? formatDistanceToNow(topic.lastReplyAt.toDate(), { addSuffix: true, locale: es }) : "-"}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                             <Button variant="ghost" size="icon" title="Reportar tema" onClick={() => onReport(topic.id)}>
                                <Flag className="h-4 w-4" />
                            </Button>
                            {canManage && (
                                <Button variant="destructive" size="icon" title="Eliminar tema" onClick={() => handleDeleteClick(topic)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-lg">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold">No hay temas en el foro</h2>
            <p className="text-muted-foreground">¡Sé el primero en iniciar una conversación!</p>
        </div>
      )}
    </div>
  );
}
