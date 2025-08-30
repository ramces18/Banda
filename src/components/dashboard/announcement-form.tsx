"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import type { Announcement } from "@/lib/types";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  titulo: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  contenido: z.string().min(10, "El contenido debe tener al menos 10 caracteres."),
  importancia: z.enum(["baja", "normal", "alta"]),
});

interface AnnouncementFormProps {
  announcement?: Announcement | null;
  onFinished: () => void;
}

export function AnnouncementForm({ announcement, onFinished }: AnnouncementFormProps) {
  const { bandUser } = useAuth();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: announcement?.titulo || "",
      contenido: announcement?.contenido || "",
      importancia: announcement?.importancia || "normal",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!bandUser) {
      toast({ variant: "destructive", description: "No estás autenticado." });
      return;
    }

    try {
      if (announcement) {
        // Update existing
        const announcementRef = doc(db, "announcements", announcement.id);
        await updateDoc(announcementRef, values);
        toast({ description: "Anuncio actualizado correctamente." });
      } else {
        // Create new
        await addDoc(collection(db, "announcements"), {
          ...values,
          autor: bandUser.id,
          fecha: serverTimestamp(),
        });
        toast({ description: "Anuncio creado correctamente." });
      }
      onFinished();
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast({ variant: "destructive", description: "Ocurrió un error al guardar el anuncio." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título del anuncio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contenido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido</FormLabel>
              <FormControl>
                <Textarea placeholder="Escribe el contenido del anuncio aquí..." {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="importancia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Importancia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un nivel de importancia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
           {announcement ? "Actualizar Anuncio" : "Crear Anuncio"}
        </Button>
      </form>
    </Form>
  );
}
