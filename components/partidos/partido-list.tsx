"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Partido {
  id: string;
  fecha: string;
  equipo_1: string;
  equipo_2: string;
  resultado?: string;
  estado: "programado" | "en_curso" | "finalizado";
  cancha?: string;
}

interface PartidoListProps {
  partidos: Partido[];
}

export function PartidoList({ partidos }: PartidoListProps) {
  if (partidos.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay partidos registrados aún.
      </p>
    );
  }

  const estadoBadge = {
    programado: "bg-blue-100 text-blue-800",
    en_curso: "bg-green-100 text-green-800",
    finalizado: "bg-gray-100 text-gray-800",
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Equipos</TableHead>
          <TableHead>Cancha</TableHead>
          <TableHead>Resultado</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {partidos.map((partido) => (
          <TableRow key={partido.id}>
            <TableCell>{partido.fecha}</TableCell>
            <TableCell className="font-medium">
              {partido.equipo_1} vs {partido.equipo_2}
            </TableCell>
            <TableCell>{partido.cancha || "N/A"}</TableCell>
            <TableCell>{partido.resultado || "-"}</TableCell>
            <TableCell>
              <Badge className={estadoBadge[partido.estado]}>
                {partido.estado.replace("_", " ")}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Link href={`/partidos/${partido.id}`}>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </Link>
                <Link href={`/partidos/${partido.id}/acta`}>
                  <Button size="sm">Acta</Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
