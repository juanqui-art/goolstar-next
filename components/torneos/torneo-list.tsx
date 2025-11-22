"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Torneo {
  id: string
  nombre: string
  categoria_id: string
  fecha_inicio: string
  fecha_fin?: string | null
}

interface TorneoListProps {
  torneos: Torneo[]
}

export function TorneoList({ torneos }: TorneoListProps) {
  if (torneos.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay torneos registrados aún.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Fecha Inicio</TableHead>
          <TableHead>Fecha Fin</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {torneos.map((torneo) => (
          <TableRow key={torneo.id}>
            <TableCell className="font-medium">{torneo.nombre}</TableCell>
            <TableCell>{torneo.categoria_id}</TableCell>
            <TableCell>{torneo.fecha_inicio}</TableCell>
            <TableCell>{torneo.fecha_fin || "N/A"}</TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Link href={`/torneos/${torneo.id}`}>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </Link>
                <Link href={`/torneos/${torneo.id}/editar`}>
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
  )
}
