"use client";

import { useState } from "react";
import { Calendar, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartidosList } from "./partidos-list-view";
import { CalendarioPartidos } from "./calendario-partidos";
import type { PartidoWithRelations } from "@/actions/partidos";

interface PartidosTabsProps {
  partidos: PartidoWithRelations[];
}

export function PartidosTabs({ partidos }: PartidosTabsProps) {
  const [activeTab, setActiveTab] = useState("lista");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="lista" className="flex items-center gap-2">
          <List className="h-4 w-4" />
          Lista
        </TabsTrigger>
        <TabsTrigger value="calendario" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Calendario
        </TabsTrigger>
      </TabsList>

      <TabsContent value="lista" className="mt-6">
        <PartidosList partidos={partidos} />
      </TabsContent>

      <TabsContent value="calendario" className="mt-6">
        <CalendarioPartidos partidos={partidos} />
      </TabsContent>
    </Tabs>
  );
}
