
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CalendarDays } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const schedule = [
  { day: "Lunes", time: "10:00 AM - 11:20 AM", type: "Ensayo General" },
  { day: "Martes", time: "10:00 AM - 11:20 AM", type: "Ensayo General" },
  { day: "Viernes", time: "10:00 AM - 11:20 AM", type: "Ensayo General" },
  { day: "Sábado", time: "10:00 AM - 11:20 AM", type: "Ensayo General" },
  { day: "Domingo", time: "10:00 AM - 11:20 AM", type: "Ensayo General" },
];

export default function SchedulesPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Horarios</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Horario Fijo de Ensayos</CardTitle>
              <CardDescription>Este es el horario regular de ensayos para la banda. Cualquier cambio o ensayo extraordinario se anunciará en la sección de eventos.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
            {schedule.map((item, index) => (
              <React.Fragment key={item.day}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                     <CalendarDays className="h-6 w-6 text-primary" />
                     <div>
                        <p className="font-bold text-lg">{item.day}</p>
                        <p className="text-sm text-muted-foreground">{item.type}</p>
                     </div>
                  </div>
                   <p className="font-semibold text-primary mt-2 sm:mt-0">{item.time}</p>
                </div>
                {index < schedule.length - 1 && <Separator />}
              </React.Fragment>
            ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
