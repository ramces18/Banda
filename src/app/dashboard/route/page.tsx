
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export default function RoutePage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recorrido del Desfile</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Map className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Ruta Oficial</CardTitle>
              <CardDescription>Este es el mapa del recorrido desde la Taquería Costa Rica hasta el Instituto de Desarrollo de Inteligencia.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
           <div className="aspect-video w-full overflow-hidden rounded-lg border">
             <iframe
                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d3929.988224951919!2d-84.10463272498616!3d9.91560269016834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x8fa0fccac0e556cd%3A0xd2ea9263e203a69b!2sTaquer%C3%ADa%20Costa%20Rica%2C%20Calle%20Costa%20Rica%2C%20San%20Jos%C3%A9%2C%20Hatillo%203%2C%20Costa%20Rica!3m2!1d9.9156027!2d-84.1024578!4m5!1s0x8fa0e34b02b4cc2f%3A0x6100635a97bdf678!2sInstituto%20de%20Desarrollo%20de%20Inteligencia%2C%20Instituto%20de%20Desarrollo%20de%20la%20Inteligencia%2C%20Avenida%20Villanea%2C%20San%20Jos%C3%A9%20Province%2C%20San%20Jos%C3%A9%2C%20Hatillo%20District%2C%20Costa%20Rica!3m2!1d9.9199492!2d-84.0993048!5e0!3m2!1sen!2scr!4v1722026857143!5m2!1sen!2scr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
