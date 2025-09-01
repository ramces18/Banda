
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import type { Announcement } from "@/lib/types";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, Loader2, X } from "lucide-react";
import { useState, useRef } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { RichTextEditor } from "../ui/rich-text-editor";

const formSchema = z.object({
  titulo: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  contenido: z.string().min(20, "El contenido debe tener al menos 20 caracteres."),
  importancia: z.enum(["baja", "normal", "alta"]),
  imageUrl: z.string().url("Debe ser una URL de imagen válida.").optional().or(z.literal("")),
});

interface AnnouncementFormProps {
  announcement?: Announcement | null;
  onFinished: () => void;
}

export function AnnouncementForm({ announcement, onFinished }: AnnouncementFormProps) {
  const { bandUser } = useAuth();
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(announcement?.imageUrl || null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: announcement?.titulo || "",
      contenido: announcement?.contenido || "",
      importancia: announcement?.importancia || "normal",
      imageUrl: announcement?.imageUrl || "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("imageUrl", ""); // Clear previous URL if a new file is selected
    }
  };

  const handleRemoveImage = () => {
      setImageFile(null);
      setImagePreview(null);
      form.setValue("imageUrl", "");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!bandUser) {
      toast({ variant: "destructive", description: "No estás autenticado." });
      return;
    }

    let finalImageUrl = announcement?.imageUrl || "";

    try {
      if (imageFile) {
        // Upload new image
        const storageRef = ref(storage, `announcements/${Date.now()}_${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        finalImageUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Upload failed", error);
              reject("Error al subir la imagen.");
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      } else if (!imagePreview) {
          // If image was removed, ensure URL is empty
          finalImageUrl = "";
      }


      const dataToSave = {
        ...values,
        imageUrl: finalImageUrl,
      };
      
      if (announcement) {
        const announcementRef = doc(db, "announcements", announcement.id);
        await updateDoc(announcementRef, dataToSave);
        toast({ description: "Anuncio actualizado correctamente." });
      } else {
        await addDoc(collection(db, "announcements"), {
          ...dataToSave,
          autor: bandUser.id,
          fecha: serverTimestamp(),
        });
        toast({ description: "Anuncio creado correctamente." });
      }
      onFinished();

    } catch (error) {
      console.error("Error submitting form: ", error);
      toast({ variant: "destructive", description: "Ocurrió un error al guardar el anuncio." });
    } finally {
        setUploadProgress(null);
    }
  }
  
  const importanceColorClass = {
    alta: "border-red-500/50 focus-within:border-red-500",
    normal: "border-border",
    baja: "border-blue-500/50 focus-within:border-blue-500",
  }[form.watch('importancia')]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título del anuncio" {...field} disabled={isSubmitting}/>
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
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger className={importanceColorClass}>
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
        
        <FormField
          control={form.control}
          name="contenido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido</FormLabel>
              <FormControl>
                <RichTextEditor 
                  className={importanceColorClass} 
                  {...field} 
                  ref={null}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <FormLabel>Imagen del Anuncio (Opcional)</FormLabel>
          {imagePreview && (
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <Image src={imagePreview} alt="Vista previa" fill className="object-cover"/>
                {!isSubmitting && (
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="destructive" 
                      onClick={handleRemoveImage} 
                      className="absolute top-2 right-2 h-7 w-7 rounded-full"
                    >
                        <X className="h-4 w-4"/>
                        <span className="sr-only">Eliminar imagen</span>
                    </Button>
                )}
            </div>
          )}

          <div className="flex items-center gap-2">
             <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                <ImageIcon className="mr-2 h-4 w-4" />
                {imagePreview ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
            </Button>
            <Input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
                disabled={isSubmitting}
            />
          </div>
           {uploadProgress !== null && (
              <div className="space-y-1">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-muted-foreground text-center">Subiendo... {Math.round(uploadProgress)}%</p>
              </div>
          )}
          <FormDescription>
            Puedes añadir una imagen opcional para tu anuncio.
          </FormDescription>
        </div>


        <Button type="submit" disabled={isSubmitting}>
           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
           {announcement ? "Actualizar Anuncio" : "Crear Anuncio"}
        </Button>
      </form>
    </Form>
  );
}
