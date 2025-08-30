
"use client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const { bandUser, setBandUser } = useAuth(); 
  const { toast } = useToast();

  const [nombreCompleto, setNombreCompleto] = useState(bandUser?.nombreCompleto || "");
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bandUser) return;

    // Do nothing if name hasn't changed
    if (nombreCompleto === bandUser.nombreCompleto) {
        return;
    }

    setIsSaving(true);
    try {
      const userRef = doc(db, "users", bandUser.id);
      await updateDoc(userRef, {
        nombreCompleto: nombreCompleto,
      });

      // Optimistically update local state
      if (setBandUser) {
        setBandUser({ ...bandUser, nombreCompleto });
      }

      toast({
        description: "Perfil actualizado correctamente.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        description: "No se pudo actualizar el perfil.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!bandUser) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mi Perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Aquí puedes ver y editar la información de tu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${bandUser.id}`} />
                <AvatarFallback>{getInitials(bandUser.nombreCompleto)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                 <p className="text-sm text-muted-foreground">
                    La foto de perfil se genera automáticamente. Próximamente podrás subir tu propia foto y personalizarla.
                 </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input id="username" value={bandUser.username} disabled />
                 <p className="text-xs text-muted-foreground">Tu nombre de usuario no se puede cambiar.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <Input id="rol" value={bandUser.rol.charAt(0).toUpperCase() + bandUser.rol.slice(1)} disabled />
                 <p className="text-xs text-muted-foreground">Tu rol es asignado por un líder.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombreCompleto">Nombre Completo</Label>
              <Input
                id="nombreCompleto"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" disabled={isSaving || nombreCompleto === bandUser.nombreCompleto}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
