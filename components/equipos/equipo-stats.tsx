import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EquipoStatsProps {
  partidosJugados: number
  partidosGanados: number
  partidosEmpatados: number
  partidosPerdidos: number
  golesFavor: number
  golesContra: number
  puntos: number
}

export function EquipoStats({
  partidosJugados,
  partidosGanados,
  partidosEmpatados,
  partidosPerdidos,
  golesFavor,
  golesContra,
  puntos,
}: EquipoStatsProps) {
  const diferenciaGoles = golesFavor - golesContra

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Puntos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{puntos}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Partidos Jugados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{partidosJugados}</div>
          <p className="text-xs text-muted-foreground">
            {partidosGanados}G {partidosEmpatados}E {partidosPerdidos}P
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Goles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{golesFavor}</div>
          <p className="text-xs text-muted-foreground">
            {golesContra} en contra
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Diferencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${diferenciaGoles >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {diferenciaGoles > 0 ? '+' : ''}{diferenciaGoles}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
