import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TeamStanding {
  posicion: number
  equipo: string
  PJ: number // Partidos jugados
  PG: number // Partidos ganados
  PE: number // Partidos empatados
  PP: number // Partidos perdidos
  GF: number // Goles a favor
  GC: number // Goles en contra
  DG: number // Diferencia de goles
  puntos: number
}

interface TablaPosicionesProps {
  standings: TeamStanding[]
}

export function TablaPosiciones({ standings }: TablaPosicionesProps) {
  if (standings.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay datos de tabla de posiciones aún.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Equipo</TableHead>
            <TableHead className="text-center">PJ</TableHead>
            <TableHead className="text-center">PG</TableHead>
            <TableHead className="text-center">PE</TableHead>
            <TableHead className="text-center">PP</TableHead>
            <TableHead className="text-center">GF</TableHead>
            <TableHead className="text-center">GC</TableHead>
            <TableHead className="text-center">DG</TableHead>
            <TableHead className="text-center font-bold">PTS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((team) => (
            <TableRow key={team.posicion}>
              <TableCell className="font-medium">{team.posicion}</TableCell>
              <TableCell className="font-medium">{team.equipo}</TableCell>
              <TableCell className="text-center">{team.PJ}</TableCell>
              <TableCell className="text-center">{team.PG}</TableCell>
              <TableCell className="text-center">{team.PE}</TableCell>
              <TableCell className="text-center">{team.PP}</TableCell>
              <TableCell className="text-center">{team.GF}</TableCell>
              <TableCell className="text-center">{team.GC}</TableCell>
              <TableCell className="text-center">{team.DG}</TableCell>
              <TableCell className="text-center font-bold">{team.puntos}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
