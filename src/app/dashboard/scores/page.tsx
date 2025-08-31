"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Music } from "lucide-react";

const scores = [
  { name: "Himno 15", notes: "" },
  { name: "Caña Dulce", notes: "" },
  { name: "Cimarrona", notes: "" },
  { name: "Bolero (Bomboro con Perfume)", notes: "" },
  { name: "Merengues (Volvere y Noches)", notes: "" },
  { name: "Cumbias (Campirana Racha y Como ye voy a olvidar)", notes: "" },
  { name: "Lowrider con BLINDING", notes: "" },
  { name: "MATADOR", notes: "" },
  { name: "RICURAS", notes: "" },
  { name: "Marcha", notes: "Debemos tocar suave, que suene a marcha, no a comparsa." },
];

export default function ScoresPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Partituras</h1>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
              <Music className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Biblioteca de Partituras</CardTitle>
                <CardDescription>Aquí encontrarás todas las partituras y canciones de la banda.</CardDescription>
              </div>
          </div>
        </CardHeader>
        <CardContent>
           <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Nombre de la Partitura</TableHead>
                            <TableHead>Notas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scores.map((score, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{score.name}</TableCell>
                                <TableCell className="text-muted-foreground">{score.notes}</TableCell>
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
