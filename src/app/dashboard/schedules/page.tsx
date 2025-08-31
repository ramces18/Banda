
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock } from "lucide-react";

const schedule = [
  { day: "Lunes", time: "10:00 AM - 11:20 AM" },
  { day: "Martes", time: "10:00 AM - 11:20 AM" },
  { day: "Viernes", time: "10:00 AM - 11:20 AM" },
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
           <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/2">Día</TableHead>
                            <TableHead className="w-1/2 text-left">Hora</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schedule.map((item) => (
                            <TableRow key={item.day}>
                                <TableCell className="font-medium">{item.day}</TableCell>
                                <TableCell>{item.time}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
