"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { BandUser } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserForm } from "@/components/dashboard/user-form";
import { Loader2, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function UsersPage() {
  const { bandUser } = useAuth();
  const [users, setUsers] = useState<BandUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<BandUser | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (bandUser?.rol !== "lider") {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersData: BandUser[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as BandUser);
      });
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [bandUser]);

  const handleEditClick = (user: BandUser) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };
  
  const handleFormFinished = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const roleVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
    lider: "destructive",
    dirigente: "default",
    miembro: "secondary",
  };

  if (loading) {
    return <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (bandUser?.rol !== "lider") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-lg">
          <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold">Acceso Denegado</h2>
          <p className="text-muted-foreground">No tienes permisos para ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestionar Usuarios</h1>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Miembros</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nombreCompleto}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge variant={roleVariantMap[user.rol] || "secondary"} className="capitalize">{user.rol}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.fechaRegistro ? format(user.fechaRegistro.toDate(), "dd/MM/yyyy", { locale: es }) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(user)}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserForm user={selectedUser} onFinished={handleFormFinished} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
