"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Announcement, BandUser } from "@/lib/types";
import { AnnouncementCard } from "@/components/dashboard/announcement-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnnouncementForm } from "@/components/dashboard/announcement-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function AnnouncementsList() {
  const { bandUser } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingAnnouncementId, setDeletingAnnouncementId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("fecha", "desc"));
    
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      setLoading(true);
      const authorPromises = querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const announcement: Announcement = { id: docSnapshot.id, ...data } as Announcement;
        
        if (data.autor) {
          const authorDoc = await getDoc(doc(db, "users", data.autor));
          if (authorDoc.exists()) {
            announcement.autorNombre = (authorDoc.data() as BandUser).nombreCompleto;
          }
        }
        return announcement;
      });

      const announcementsData = await Promise.all(authorPromises);
      setAnnouncements(announcementsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching announcements:", error);
      toast({ variant: "destructive", description: "No se pudieron cargar los anuncios."});
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const canManage = useMemo(() => {
    return bandUser?.rol === "lider" || bandUser?.rol === "dirigente";
  }, [bandUser]);
  
  const sortedAnnouncements = useMemo(() => {
    const importanceOrder = { 'alta': 1, 'normal': 2, 'baja': 3 };
    return [...announcements].sort((a, b) => {
      const importanceDiff = importanceOrder[a.importancia] - importanceOrder[b.importancia];
      if (importanceDiff !== 0) return importanceDiff;
      if (!a.fecha || !b.fecha) return 0;
      return b.fecha.toMillis() - a.fecha.toMillis();
    });
  }, [announcements]);

  const handleCreateClick = () => {
    setEditingAnnouncement(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingAnnouncementId(id);
    setIsDeleteDialogOpen(true);
  }

  const confirmDelete = async () => {
    if (!deletingAnnouncementId) return;
    try {
      await deleteDoc(doc(db, "announcements", deletingAnnouncementId));
      toast({ description: "Anuncio eliminado correctamente." });
    } catch (error) {
      toast({ variant: "destructive", description: "No se pudo eliminar el anuncio." });
      console.error("Error deleting announcement:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingAnnouncementId(null);
    }
  }

  const handleFormFinished = () => {
    setIsFormOpen(false);
    setEditingAnnouncement(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Últimos Anuncios</CardTitle>
            <CardDescription>Mantente informado sobre las últimas noticias de la banda.</CardDescription>
        </div>
        {canManage && (
          <Button onClick={handleCreateClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Anuncio
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? "Editar Anuncio" : "Crear Nuevo Anuncio"}</DialogTitle>
              <DialogDescription>
                {editingAnnouncement ? "Modifica los detalles y guarda los cambios." : "Rellena el formulario para publicar un nuevo anuncio."}
              </DialogDescription>
            </DialogHeader>
            <AnnouncementForm 
              onFinished={handleFormFinished}
              announcement={editingAnnouncement} 
            />
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro de que quieres eliminar?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El anuncio se eliminará permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : announcements.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sortedAnnouncements.map((announcement) => (
              <AnnouncementCard 
                  key={announcement.id} 
                  announcement={announcement}
                  canManage={canManage}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No hay anuncios publicados todavía.</p>
            {canManage && <Button onClick={handleCreateClick} className="mt-4">Crear el primer anuncio</Button>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
