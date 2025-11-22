"use client";

import Link from "next/link";
import { Eye, Pencil, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils/format";
import type { PartidoWithRelations } from "@/actions/partidos";

interface PartidosListProps {
  partidos: PartidoWithRelations[];
}

export function PartidosList({ partidos }: PartidosListProps) {
  // Sort partidos by date (most recent first)
  const sortedPartidos = [...partidos].sort((a, b) => {
    if (!a.fecha && !b.fecha) return 0;
    if (!a.fecha) return 1;
    if (!b.fecha) return -1;
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Partidos</CardTitle>
        <CardDescription>
          {partidos.length} partido{partidos.length !== 1 ? "s" : ""} en total
        </CardDescription>
      </CardHeader>
      <CardContent>
        {partidos.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay partidos programados</h3>
            <p className="text-muted-foreground mb-4">
              Comienza creando el fixture para tu torneo
            </p>
            <Link href="/partidos/nuevo">
              <Button>Programar Primer Partido</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Equipos</TableHead>
                <TableHead className="text-center">Resultado</TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPartidos.map(partido => (
                <TableRow key={partido.id}>
                  <TableCell>
                    {partido.fecha ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatDate(new Date(partido.fecha))}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(new Date(partido.fecha))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Por programar</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">
                        {partido.equipo_local?.nombre || "TBD"}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {partido.equipo_visitante?.nombre || "TBD"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {partido.completado ? (
                      <div className="font-mono font-bold text-lg">
                        {partido.goles_equipo_1 ?? 0} - {partido.goles_equipo_2 ?? 0}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">vs</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      {partido.cancha && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {partido.cancha}
                        </div>
                      )}
                      {partido._count && (
                        <div className="flex gap-2 text-xs">
                          {partido._count.goles > 0 && (
                            <Badge variant="outline" className="h-5 px-1.5">
                              ⚽ {partido._count.goles}
                            </Badge>
                          )}
                          {partido._count.tarjetas > 0 && (
                            <Badge variant="outline" className="h-5 px-1.5">
                              🟨 {partido._count.tarjetas}
                            </Badge>
                          )}
                          {partido._count.cambios > 0 && (
                            <Badge variant="outline" className="h-5 px-1.5">
                              🔄 {partido._count.cambios}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {partido.completado ? (
                      <Badge variant="secondary">Finalizado</Badge>
                    ) : (
                      <Badge variant="outline">Programado</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/partidos/${partido.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {!partido.completado && (
                        <Link href={`/partidos/${partido.id}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
