
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnouncementsList } from "@/components/dashboard/announcements-list";
import { EventsList } from "@/components/dashboard/events-list";

export default function AnnouncementsAndEventsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Anuncios y Eventos</h1>
      
      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="announcements">Anuncios</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>
        <TabsContent value="announcements">
            <AnnouncementsList />
        </TabsContent>
        <TabsContent value="events">
            <EventsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
