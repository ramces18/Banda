
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
                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d31439.51000624823!2d-84.12089414925707!3d9.99842187900055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x8fa0faddd54480e7%3A0x64a95a8942a78f3!2sTaqueria%20Costa%20Rica%2C%20Av.%201%2C%20Heredia!3m2!1d9.998616!2d-84.118903!4m5!1s0x8fa0fae3f05f7c35%3A0x51405e3f53833e2a!2sInstituto%20de%20Desarrollo%20de%20Inteligencia%2C%20Heredia%20Province%2C%20Heredia!3m2!1d9.9972848!2d-84.1214041!5e0!3m2!1sen!2sus!4v1719946227301!5m2!1sen!2sus"
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
