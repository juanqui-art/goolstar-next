import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActaPartidoProps {
  partido: {
    id: string;
    fecha: string;
    equipo_1: string;
    equipo_2: string;
    resultado: string;
    goles: Array<{ jugador: string; minuto: number; equipo: string }>;
    tarjetas: Array<{
      jugador: string;
      minuto: number;
      tipo: string;
      equipo: string;
    }>;
    cambios: Array<{
      sale: string;
      entra: string;
      minuto: number;
      equipo: string;
    }>;
  };
}

export function ActaPartido({ partido }: ActaPartidoProps) {
  return (
    <div className="space-y-6">
      {/* Match Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Partido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Fecha:</span> {partido.fecha}
            </p>
            <p>
              <span className="font-medium">Equipos:</span> {partido.equipo_1}{" "}
              vs {partido.equipo_2}
            </p>
            <p>
              <span className="font-medium">Resultado:</span>{" "}
              {partido.resultado}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Goles</CardTitle>
        </CardHeader>
        <CardContent>
          {partido.goles.length === 0 ? (
            <p className="text-gray-500">No hay goles registrados</p>
          ) : (
            <ul className="space-y-2">
              {partido.goles.map((gol, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {gol.jugador} ({gol.equipo})
                  </span>
                  <span className="text-gray-600">Min. {gol.minuto}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Tarjetas</CardTitle>
        </CardHeader>
        <CardContent>
          {partido.tarjetas.length === 0 ? (
            <p className="text-gray-500">No hay tarjetas registradas</p>
          ) : (
            <ul className="space-y-2">
              {partido.tarjetas.map((tarjeta, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    <span
                      className={
                        tarjeta.tipo === "roja"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }
                    >
                      ■
                    </span>{" "}
                    {tarjeta.jugador} ({tarjeta.equipo})
                  </span>
                  <span className="text-gray-600">Min. {tarjeta.minuto}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Substitutions */}
      <Card>
        <CardHeader>
          <CardTitle>Cambios</CardTitle>
        </CardHeader>
        <CardContent>
          {partido.cambios.length === 0 ? (
            <p className="text-gray-500">No hay cambios registrados</p>
          ) : (
            <ul className="space-y-2">
              {partido.cambios.map((cambio, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    ↓ {cambio.sale} → ↑ {cambio.entra} ({cambio.equipo})
                  </span>
                  <span className="text-gray-600">Min. {cambio.minuto}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
