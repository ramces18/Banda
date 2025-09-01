"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "@/components/dashboard/event-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfMonth, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";


export function EventsList() {
  const { bandUser } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

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

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach(event => {
        const day = format(event.date.toDate(), "yyyy-MM-dd");
        if (!map.has(day)) {
            map.set(day, []);
        }
        map.get(day)?.push(event);
    });
    return map;
  }, [events]);
  
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
  
  const DayWithEvents = ({ date }: { date: Date }) => {
    const dayStr = format(date, "yyyy-MM-dd");
    const dayEvents = eventsByDay.get(dayStr);
    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center">
            <span>{format(date, "d")}</span>
            {dayEvents && (
                 <div className="absolute bottom-1 flex gap-1">
                    {dayEvents.slice(0, 3).map((event, i) => (
                        <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary" />
                    ))}
                </div>
            )}
        </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Calendario de Eventos</CardTitle>
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
        ) : (
          <div className="space-y-4">
             <div className="flex justify-between items-center px-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold capitalize">
                    {format(currentMonth, "MMMM yyyy", { locale: es })}
                </h2>
                <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <Calendar
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                locale={es}
                components={{
                    Day: DayWithEvents,
                }}
                className="p-0"
                classNames={{
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-14 w-full rounded-md p-1 hover:bg-accent",
                    day_today: "bg-muted text-foreground font-bold",
                    day_outside: "text-muted-foreground opacity-50",
                }}
            />
             <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold">Eventos del mes</h3>
                <div className="space-y-2">
                    {events.filter(e => format(e.date.toDate(), 'yyyy-MM') === format(currentMonth, 'yyyy-MM')).map(event => (
                        <div key={event.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                            <div>
                                <p className="font-semibold">{event.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(event.date.toDate(), "d 'de' MMMM, h:mm a", { locale: es })}
                                </p>
                            </div>
                           <Link href={`/dashboard/announcements/events/${event.id}`}>
                                <Badge>{event.type}</Badge>
                           </Link>
                        </div>
                    ))}
                </div>
                 {events.filter(e => format(e.date.toDate(), 'yyyy-MM') === format(currentMonth, 'yyyy-MM')).length === 0 && (
                     <p className="text-center text-muted-foreground">No hay eventos para este mes.</p>
                 )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}