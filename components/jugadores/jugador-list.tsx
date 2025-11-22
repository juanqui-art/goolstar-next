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
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Jugador {
  id: string
  nombre_completo: string
  numero_dorsal: number
  equipo: string
  posicion?: string
  suspendido: boolean
}

interface JugadorListProps {
  jugadores: Jugador[]
}

export function JugadorList({ jugadores }: JugadorListProps) {
  if (jugadores.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay jugadores registrados aún.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dorsal</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Equipo</TableHead>
          <TableHead>Posición</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jugadores.map((jugador) => (
          <TableRow key={jugador.id}>
            <TableCell>
              <Badge variant="outline">#{jugador.numero_dorsal}</Badge>
            </TableCell>
            <TableCell className="font-medium">{jugador.nombre_completo}</TableCell>
            <TableCell>{jugador.equipo}</TableCell>
            <TableCell>{jugador.posicion || "N/A"}</TableCell>
            <TableCell>
              {jugador.suspendido ? (
                <Badge variant="destructive">Suspendido</Badge>
              ) : (
                <Badge variant="default">Activo</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Link href={`/jugadores/${jugador.id}`}>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </Link>
                <Link href={`/jugadores/${jugador.id}/editar`}>
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
