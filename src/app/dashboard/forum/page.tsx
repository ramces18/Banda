
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ForumTopic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, Loader2 } from "lucide-react";
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

export default function ForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
                    <TableHead className="text-right">Última Actividad</TableHead>
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
                        <TableCell className="text-right">
                             {topic.lastReplyAt ? formatDistanceToNow(topic.lastReplyAt.toDate(), { addSuffix: true, locale: es }) : "-"}
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
