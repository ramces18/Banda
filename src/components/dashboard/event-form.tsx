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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Event } from "@/lib/types";
import { addDoc, collection, doc, serverTimestamp, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const formSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  date: z.date({ required_error: "La fecha es obligatoria." }),
  type: z.enum(['Ensayo', 'Acto Cívico', 'Desfile', 'Presentación', 'Otro']),
});

interface EventFormProps {
  event?: Event | null;
  onFinished: () => void;
}

export function EventForm({ event, onFinished }: EventFormProps) {
  const { bandUser } = useAuth();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      date: event?.date ? event.date.toDate() : new Date(),
      type: event?.type || "Ensayo",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!bandUser) {
      toast({ variant: "destructive", description: "No estás autenticado." });
      return;
    }
    
    const dataToSave = {
        ...values,
        date: Timestamp.fromDate(values.date),
    };

    try {
      if (event) {
        const eventRef = doc(db, "events", event.id);
        await updateDoc(eventRef, dataToSave);
        toast({ description: "Evento actualizado correctamente." });
      } else {
        await addDoc(collection(db, "events"), {
          ...dataToSave,
          createdBy: bandUser.id,
        });
        toast({ description: "Evento creado correctamente." });
      }
      onFinished();
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast({ variant: "destructive", description: "Ocurrió un error al guardar el evento." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Desfile de Independencia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe el evento, ubicación, hora, etc." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Fecha del Evento</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP", { locale: es })
                        ) : (
                            <span>Elige una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tipo de Evento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Ensayo">Ensayo</SelectItem>
                    <SelectItem value="Acto Cívico">Acto Cívico</SelectItem>
                    <SelectItem value="Desfile">Desfile</SelectItem>
                    <SelectItem value="Presentación">Presentación</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button type="submit" disabled={isSubmitting}>
           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
           {event ? "Actualizar Evento" : "Crear Evento"}
        </Button>
      </form>
    </Form>
  );
}
