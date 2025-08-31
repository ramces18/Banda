"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Event } from "@/lib/types";
import { EventCard } from "@/components/dashboard/event-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "@/components/dashboard/event-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function EventsList() {
  const { bandUser } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "asc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setLoading(true);
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      toast({ variant: "destructive", description: "No se pudieron cargar los eventos."});
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const canManage = useMemo(() => {
    return bandUser?.rol === "lider" || bandUser?.rol === "dirigente";
  }, [bandUser]);
  
  const handleCreateClick = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingEventId(id);
    setIsDeleteDialogOpen(true);
  }

  const confirmDelete = async () => {
    if (!deletingEventId) return;
    try {
      await deleteDoc(doc(db, "events", deletingEventId));
      toast({ description: "Evento eliminado correctamente." });
    } catch (error) {
      toast({ variant: "destructive", description: "No se pudo eliminar el evento." });
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingEventId(null);
    }
  }

  const handleFormFinished = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Calendario de ensayos, presentaciones y más.</CardDescription>
        </div>
        {canManage && (
          <Button onClick={handleCreateClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Evento
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Editar Evento" : "Crear Nuevo Evento"}</DialogTitle>
              <DialogDescription>
                {editingEvent ? "Modifica los detalles y guarda los cambios." : "Rellena el formulario para añadir un nuevo evento."}
              </DialogDescription>
            </DialogHeader>
            <EventForm 
              onFinished={handleFormFinished}
              event={editingEvent} 
            />
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro de que quieres eliminar?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El evento se eliminará permanentemente.
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
        ) : events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <EventCard 
                  key={event.id} 
                  event={event}
                  canManage={canManage}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No hay eventos programados todavía.</p>
            {canManage && <Button onClick={handleCreateClick} className="mt-4">Crear el primer evento</Button>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
