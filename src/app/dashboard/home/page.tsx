
"use client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Megaphone, Users, Music } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { bandUser } = useAuth();
  const [stats, setStats] = useState({ users: 0, announcements: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const announcementsSnapshot = await getDocs(collection(db, "announcements"));
        setStats({
          users: usersSnapshot.size,
          announcements: announcementsSnapshot.size,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const roleInfo = {
    lider: {
      title: "Panel de Líder",
      description: "Tienes acceso total para gestionar usuarios, anuncios y más.",
      icon: <Users className="h-8 w-8 text-primary" />,
    },
    dirigente: {
      title: "Panel de Dirigente",
      description: "Puedes crear, editar y visualizar todos los anuncios.",
      icon: <Megaphone className="h-8 w-8 text-primary" />,
    },
    miembro: {
      title: "Panel de Miembro",
      description: "Mantente al día con los últimos anuncios y eventos de la banda.",
      icon: <Music className="h-8 w-8 text-primary" />,
    },
  };

  if (!bandUser) return null;
  
  const currentRoleInfo = roleInfo[bandUser.rol];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bienvenido, {bandUser.nombreCompleto}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tu Rol</CardTitle>
            {currentRoleInfo.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{bandUser.rol}</div>
            <p className="text-xs text-muted-foreground">
              {currentRoleInfo.description}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Miembros Totales</CardTitle>
            <Users className="h-8 w-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados en el sistema
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anuncios Activos</CardTitle>
            <Megaphone className="h-8 w-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.announcements}</div>
            <p className="text-xs text-muted-foreground">
              Anuncios publicados para la banda
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
