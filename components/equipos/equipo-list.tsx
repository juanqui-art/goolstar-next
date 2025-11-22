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

interface Equipo {
  id: string;
  nombre: string;
  color_principal: string;
  categoria: string;
  torneo: string;
  nivel: string;
}

interface EquipoListProps {
  equipos: Equipo[];
}

export function EquipoList({ equipos }: EquipoListProps) {
  if (equipos.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay equipos registrados aún.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Torneo</TableHead>
          <TableHead>Nivel</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {equipos.map((equipo) => (
          <TableRow key={equipo.id}>
            <TableCell className="font-medium">{equipo.nombre}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: equipo.color_principal }}
                />
                <span className="text-sm text-gray-600">
                  {equipo.color_principal}
                </span>
              </div>
            </TableCell>
            <TableCell>{equipo.categoria}</TableCell>
            <TableCell>{equipo.torneo}</TableCell>
            <TableCell>
              <Badge variant="outline">Nivel {equipo.nivel}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Link href={`/equipos/${equipo.id}`}>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </Link>
                <Link href={`/equipos/${equipo.id}/editar`}>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
