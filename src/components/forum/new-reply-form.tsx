
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { addDoc, collection, doc, serverTimestamp, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  content: z.string().min(1, "La respuesta no puede estar vacía."),
});

interface NewReplyFormProps {
  topicId: string;
}

export function NewReplyForm({ topicId }: NewReplyFormProps) {
  const { bandUser } = useAuth();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!bandUser) {
      toast({ variant: "destructive", description: "No estás autenticado." });
      return;
    }

    const topicRef = doc(db, "forumTopics", topicId);
    const postsRef = collection(db, `forumTopics/${topicId}/posts`);

    try {
      await runTransaction(db, async (transaction) => {
        const topicDoc = await transaction.get(topicRef);
        if (!topicDoc.exists()) {
          throw "¡El tema no existe!";
        }

        // Add new post
        const newPostRef = doc(postsRef); // Create a new doc reference
        transaction.set(newPostRef, {
            topicId: topicId,
            authorId: bandUser.id,
            authorName: bandUser.nombreCompleto,
            content: values.content,
            createdAt: serverTimestamp(),
        });
        
        // Update topic metadata
        const newReplyCount = (topicDoc.data().replyCount || 0) + 1;
        transaction.update(topicRef, { 
            replyCount: newReplyCount,
            lastReplyAt: serverTimestamp()
        });
      });

      form.reset();
      toast({ description: "Respuesta publicada." });

    } catch (error) {
      console.error("Error posting reply: ", error);
      toast({ variant: "destructive", description: "Ocurrió un error al publicar tu respuesta." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-6 border-t">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Tu Respuesta</FormLabel>
              <FormControl>
                <Textarea placeholder="Escribe tu respuesta aquí..." {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
           Publicar Respuesta
        </Button>
      </form>
    </Form>
  );
}
