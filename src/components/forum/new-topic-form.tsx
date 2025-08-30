
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { addDoc, collection, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(10, "El título debe tener al menos 10 caracteres."),
  content: z.string().min(20, "El contenido del primer mensaje debe tener al menos 20 caracteres."),
});

interface NewTopicFormProps {
  onFinished: () => void;
}

export function NewTopicForm({ onFinished }: NewTopicFormProps) {
  const { bandUser } = useAuth();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!bandUser) {
      toast({ variant: "destructive", description: "No estás autenticado." });
      return;
    }

    try {
      const batch = writeBatch(db);
      const now = serverTimestamp();

      // 1. Create the topic document
      const topicRef = collection(db, "forumTopics");
      const newTopicRef = await addDoc(topicRef, {
        title: values.title,
        authorId: bandUser.id,
        authorName: bandUser.nombreCompleto,
        createdAt: now,
        lastReplyAt: now,
        replyCount: 0, // Starts with 0, the first post is not a "reply"
      });
      
      // 2. Create the first post in the subcollection
      const postRef = collection(db, `forumTopics/${newTopicRef.id}/posts`);
      addDoc(postRef, {
        topicId: newTopicRef.id,
        authorId: bandUser.id,
        authorName: bandUser.nombreCompleto,
        content: values.content,
        createdAt: now,
      });

      toast({ description: "Tema creado correctamente." });
      onFinished();
    } catch (error) {
      console.error("Error creating topic: ", error);
      toast({ variant: "destructive", description: "Ocurrió un error al crear el tema." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del Tema</FormLabel>
              <FormControl>
                <Input placeholder="Escribe un título claro y conciso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primer Mensaje</FormLabel>
              <FormControl>
                <Textarea placeholder="Inicia la conversación con tu primer mensaje..." {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
           Iniciar Tema
        </Button>
      </form>
    </Form>
  );
}
