
"use client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { cn } from "@/lib/utils";

const avatarStyles = [
    "micah", "bottts", "big-smile", "miniavs"
];

export default function ProfilePage() {
  const { bandUser, setBandUser } = useAuth(); 
  const { toast } = useToast();

  const [nombreCompleto, setNombreCompleto] = useState(bandUser?.nombreCompleto || "");
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState(bandUser?.avatarStyle || "micah");
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const hasChanges = useMemo(() => {
    if (!bandUser) return false;
    return nombreCompleto !== bandUser.nombreCompleto || selectedAvatarStyle !== (bandUser.avatarStyle || 'micah');
  }, [nombreCompleto, selectedAvatarStyle, bandUser]);


  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bandUser || !hasChanges) return;

    setIsSaving(true);
    try {
      const userRef = doc(db, "users", bandUser.id);
      await updateDoc(userRef, {
        nombreCompleto: nombreCompleto,
        avatarStyle: selectedAvatarStyle,
      });

      // Optimistically update local state
      if (setBandUser) {
        setBandUser({ ...bandUser, nombreCompleto, avatarStyle: selectedAvatarStyle });
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
          <form onSubmit={handleProfileUpdate} className="space-y-8">
            {/* Avatar Section */}
            <div className="space-y-4">
                <Label>Avatar</Label>
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={`https://api.dicebear.com/7.x/${selectedAvatarStyle}/svg?seed=${bandUser.id}`} />
                        <AvatarFallback>{getInitials(bandUser.nombreCompleto)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                            Elige un estilo para tu avatar de la siguiente lista. El diseño se genera automáticamente basado en tu ID de usuario.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   {avatarStyles.map(style => (
                        <button
                            type="button"
                            key={style}
                            onClick={() => setSelectedAvatarStyle(style)}
                            className={cn(
                                "rounded-lg border-2 p-2 transition-all hover:opacity-100 hover:border-primary",
                                selectedAvatarStyle === style ? "border-primary opacity-100" : "border-transparent opacity-60"
                            )}
                            title={`Estilo ${style}`}
                        >
                            <Image
                                src={`https://api.dicebear.com/7.x/${style}/svg?seed=${bandUser.id}`}
                                alt={style}
                                width={120}
                                height={120}
                                className="rounded-md bg-muted aspect-square object-cover"
                            />
                        </button>
                   ))}
                </div>
            </div>

            {/* User Info Section */}
            <div className="space-y-4">
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
            </div>
            
            <Button type="submit" disabled={isSaving || !hasChanges}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
