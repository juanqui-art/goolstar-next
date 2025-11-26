"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy } from "lucide-react";

interface TopScorer {
  jugador_id: string;
  jugador_nombre: string;
  equipo_nombre: string;
  total_goles: number;
}

interface TopScorersProps {
  scorers: TopScorer[];
  className?: string;
}

export function TopScorers({ scorers, className }: TopScorersProps) {
  if (scorers.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Tabla de Goleadores
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          No hay goleadores registrados aún.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Tabla de Goleadores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20 hover:bg-muted/20">
              <TableHead className="w-12 text-center font-bold">#</TableHead>
              <TableHead>Jugador</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead className="text-center w-20 font-bold">
                Goles
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scorers.map((scorer, index) => (
              <TableRow key={scorer.jugador_id}>
                <TableCell className="text-center font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium">
                  {scorer.jugador_nombre}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {scorer.equipo_nombre}
                </TableCell>
                <TableCell className="text-center font-bold text-lg">
                  {scorer.total_goles}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
