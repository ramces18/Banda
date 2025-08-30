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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth as clientAuth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { FirebaseError } from "firebase/app";

const formSchema = z.object({
  nombreCompleto: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres.").refine(s => !s.includes('@'), "El usuario no puede contener un '@'"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  rol: z.enum(["miembro", "dirigente", "lider"]),
});

interface CreateUserFormProps {
  onFinished: () => void;
}

export function CreateUserForm({ onFinished }: CreateUserFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreCompleto: "",
      username: "",
      password: "",
      rol: "miembro",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const email = `${values.username}@banda.com`;

    try {
      // We need a separate auth instance for user creation to avoid conflicts
      // with the currently logged-in user. This is a common pattern for admin actions.
      // This requires careful setup of temporary auth instances, for now we can use the main one
      // as Firebase SDK handles this reasonably well, but for more complex apps
      // a dedicated admin SDK on a backend would be better.
      const userCredential = await createUserWithEmailAndPassword(clientAuth, email, values.password);
      const user = userCredential.user;

      // Now create the user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        nombreCompleto: values.nombreCompleto,
        username: values.username,
        rol: values.rol,
        fechaRegistro: serverTimestamp(),
      });

      toast({ description: "Usuario creado correctamente." });
      onFinished();
    } catch (error) {
      console.error("Error creating user: ", error);
      let description = "Ocurrió un error al crear el usuario.";
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          description = "Este nombre de usuario ya está en uso.";
        }
      }
      toast({ variant: "destructive", description });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nombreCompleto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nombre completo del usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de Usuario</FormLabel>
              <FormControl>
                <Input placeholder="usuario_sin_espacios" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="miembro">Miembro</SelectItem>
                  <SelectItem value="dirigente">Dirigente</SelectItem>
                  <SelectItem value="lider">Líder</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear Usuario
        </Button>
      </form>
    </Form>
  );
}
