"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface PosicionEquipo {
  equipo_id: string;
  equipo_nombre: string;
  logo_url: string | null;
  grupo: string | null;
  partidos_jugados: number;
  partidos_ganados: number;
  partidos_empatados: number;
  partidos_perdidos: number;
  goles_favor: number;
  goles_contra: number;
  diferencia_goles: number;
  puntos: number;
}

interface TablaPosicionesProps {
  posiciones: PosicionEquipo[];
  className?: string;
}

export function TablaPosiciones({
  posiciones,
  className,
}: TablaPosicionesProps) {
  // Group teams by group (if any)
  const grupos = posiciones.reduce(
    (acc, equipo) => {
      const grupo = equipo.grupo || "General";
      if (!acc[grupo]) {
        acc[grupo] = [];
      }
      acc[grupo].push(equipo);
      return acc;
    },
    {} as Record<string, PosicionEquipo[]>,
  );

  const sortedGroups = Object.keys(grupos).sort();

  if (posiciones.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No hay datos de posiciones disponibles para este torneo.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {sortedGroups.map((grupo) => (
        <Card key={grupo} className="overflow-hidden">
          <CardHeader className="bg-muted/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              {grupo !== "General" && <Badge variant="outline">Grupo {grupo}</Badge>}
              {grupo === "General" ? "Tabla General" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20 hover:bg-muted/20">
                  <TableHead className="w-12 text-center font-bold">#</TableHead>
                  <TableHead className="min-w-[150px]">Equipo</TableHead>
                  <TableHead className="text-center w-12" title="Partidos Jugados">
                    PJ
                  </TableHead>
                  <TableHead className="text-center w-12 hidden sm:table-cell" title="Ganados">
                    G
                  </TableHead>
                  <TableHead className="text-center w-12 hidden sm:table-cell" title="Empatados">
                    E
                  </TableHead>
                  <TableHead className="text-center w-12 hidden sm:table-cell" title="Perdidos">
                    P
                  </TableHead>
                  <TableHead className="text-center w-12 hidden md:table-cell" title="Goles a Favor">
                    GF
                  </TableHead>
                  <TableHead className="text-center w-12 hidden md:table-cell" title="Goles en Contra">
                    GC
                  </TableHead>
                  <TableHead className="text-center w-12 font-medium" title="Diferencia de Goles">
                    DG
                  </TableHead>
                  <TableHead className="text-center w-16 font-bold bg-muted/30">
                    Pts
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grupos[grupo].map((equipo, index) => (
                  <TableRow key={equipo.equipo_id}>
                    <TableCell className="text-center font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {/* Placeholder for logo if needed */}
                        {/* {equipo.logo_url && (
                          <img
                            src={equipo.logo_url}
                            alt={equipo.equipo_nombre}
                            className="w-6 h-6 object-contain"
                          />
                        )} */}
                        <span className="truncate max-w-[180px] sm:max-w-none">
                          {equipo.equipo_nombre}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {equipo.partidos_jugados}
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell text-muted-foreground">
                      {equipo.partidos_ganados}
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell text-muted-foreground">
                      {equipo.partidos_empatados}
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell text-muted-foreground">
                      {equipo.partidos_perdidos}
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell text-muted-foreground">
                      {equipo.goles_favor}
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell text-muted-foreground">
                      {equipo.goles_contra}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-center font-medium",
                        equipo.diferencia_goles > 0
                          ? "text-green-600"
                          : equipo.diferencia_goles < 0
                          ? "text-red-600"
                          : "text-muted-foreground",
                      )}
                    >
                      {equipo.diferencia_goles > 0 ? "+" : ""}
                      {equipo.diferencia_goles}
                    </TableCell>
                    <TableCell className="text-center font-bold text-lg bg-muted/30">
                      {equipo.puntos}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
