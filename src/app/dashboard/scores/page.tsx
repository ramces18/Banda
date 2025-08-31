"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Music, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const scores = [
  { name: "Himno 15 – Loámoste, ¡oh Dios!", notes: "", link: "https://www.youtube.com/watch?v=6SnDWceJBws" },
  { name: "Caña Dulce – Canción folclórica de Costa Rica", notes: "", link: "https://www.youtube.com/watch?v=UOu5UVJGpAU" },
  { name: "Cimarrona La Original Domingueña – Fara Fara Chin", notes: "", link: "https://www.youtube.com/watch?v=mAPtajPRFBs" },
  { name: "Bomboro Quiñá Quiñá – La Sonora Santanera", notes: "", link: "https://www.youtube.com/watch?v=6-wOGPzTtZw" },
  { name: "Volveré – Wilfrido Vargas", notes: "", link: "https://www.youtube.com/watch?v=DwZgF23ALeM" },
  { name: "Cumbia Campirana – Super Grupo Colombia", notes: "", link: "https://www.youtube.com/watch?v=0QI8iy-UYpo" },
  { name: "Cómo Te Voy A Olvidar – Los Ángeles Azules", notes: "", link: "https://www.youtube.com/watch?v=nxXvOEPsE0s" },
  { name: "Low Rider – WAR", notes: "", link: "https://www.youtube.com/watch?v=BsrqKE1iqqo" },
  { name: "Matador – Los Fabulosos Cadillacs", notes: "", link: "https://www.youtube.com/watch?v=pjPA7CXutDw" },
  { name: "Ricuras", notes: "Pendiente de enlace" },
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
                <CardDescription>Aquí encontrarás todas las partituras y canciones de la banda, con enlaces de referencia.</CardDescription>
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
                                <TableCell>
                                    {score.link ? (
                                        <Link href={score.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                            {score.name}
                                            <LinkIcon className="h-4 w-4" />
                                        </Link>
                                    ) : (
                                        score.name
                                    )}
                                </TableCell>
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
