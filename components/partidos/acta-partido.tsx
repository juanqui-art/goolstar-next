import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActaPartidoProps {
  data: {
    partido: {
      id: string;
      fecha: string | null;
      cancha: string | null;
      goles_equipo_1: number | null;
      goles_equipo_2: number | null;
      equipo_local?: { id: string; nombre: string } | null;
      equipo_visitante?: { id: string; nombre: string } | null;
      arbitros?: { id: string; nombre: string; apellido: string } | null;
      torneos?: { id: string; nombre: string } | null;
    };
    goles: Array<{
      id: string;
      minuto: number;
      equipo_id: string;
      jugadores?: { primer_nombre: string; primer_apellido: string } | null;
    }>;
    tarjetas: Array<{
      id: string;
      minuto: number;
      tipo: string;
      equipo_id: string;
      jugadores?: { primer_nombre: string; primer_apellido: string } | null;
    }>;
    cambios: Array<{
      id: string;
      minuto: number;
      equipo_id: string;
      jugador_sale?: { primer_nombre: string; primer_apellido: string } | null;
      jugador_entra?: { primer_nombre: string; primer_apellido: string } | null;
    }>;
  };
}

export function ActaPartido({ data }: ActaPartidoProps) {
  const { partido, goles, tarjetas, cambios } = data;

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return "No especificada";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header - Professional styling */}
      <div className="border-b-2 border-black pb-4 mb-6 print:mb-4">
        <h1 className="text-3xl font-bold text-center mb-2 print:text-2xl">
          ACTA OFICIAL DE PARTIDO
        </h1>
        <p className="text-center text-gray-600 text-lg print:text-base">
          {partido.torneos?.nombre || "GoolStar Tournament"}
        </p>
      </div>

      {/* Match Info */}
      <Card className="print:border-2 print:shadow-none">
        <CardHeader className="bg-gray-100 print:bg-gray-50">
          <CardTitle className="text-xl print:text-lg">
            Información del Partido
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex">
              <span className="font-semibold w-32">Fecha y Hora:</span>
              <span>{formatFecha(partido.fecha)}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Cancha:</span>
              <span>{partido.cancha || "No especificada"}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Árbitro:</span>
              <span>
                {partido.arbitros
                  ? `${partido.arbitros.nombre} ${partido.arbitros.apellido}`
                  : "No especificado"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Box - Prominent display */}
      <div className="border-2 border-black rounded-lg p-6 bg-gray-50 print:bg-white">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold mb-2 print:text-xl">
              {partido.equipo_local?.nombre || "Equipo Local"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-5xl font-bold print:text-4xl">
              {partido.goles_equipo_1 ?? 0}
            </span>
            <span className="text-3xl font-bold text-gray-400 print:text-2xl">
              -
            </span>
            <span className="text-5xl font-bold print:text-4xl">
              {partido.goles_equipo_2 ?? 0}
            </span>
          </div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold mb-2 print:text-xl">
              {partido.equipo_visitante?.nombre || "Equipo Visitante"}
            </p>
          </div>
        </div>
      </div>

      {/* Goals */}
      <Card className="print:border-2 print:shadow-none">
        <CardHeader className="bg-gray-100 print:bg-gray-50">
          <CardTitle className="text-xl print:text-lg">Goles</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {goles.length === 0 ? (
            <p className="text-gray-500 italic">
              No se registraron goles en este partido
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="text-left py-2 px-3 font-semibold">MIN</th>
                    <th className="text-left py-2 px-3 font-semibold">
                      JUGADOR
                    </th>
                    <th className="text-left py-2 px-3 font-semibold">
                      EQUIPO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {goles.map((gol) => {
                    const equipoNombre =
                      gol.equipo_id === partido.equipo_local?.id
                        ? partido.equipo_local?.nombre
                        : partido.equipo_visitante?.nombre;
                    return (
                      <tr
                        key={gol.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-2 px-3">{gol.minuto}'</td>
                        <td className="py-2 px-3">
                          {gol.jugadores
                            ? `${gol.jugadores.primer_nombre} ${gol.jugadores.primer_apellido}`
                            : "Desconocido"}
                        </td>
                        <td className="py-2 px-3">{equipoNombre}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cards */}
      <Card className="print:border-2 print:shadow-none">
        <CardHeader className="bg-gray-100 print:bg-gray-50">
          <CardTitle className="text-xl print:text-lg">Tarjetas</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {tarjetas.length === 0 ? (
            <p className="text-gray-500 italic">
              No se registraron tarjetas en este partido
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="text-left py-2 px-3 font-semibold">MIN</th>
                    <th className="text-left py-2 px-3 font-semibold">
                      JUGADOR
                    </th>
                    <th className="text-left py-2 px-3 font-semibold">TIPO</th>
                    <th className="text-left py-2 px-3 font-semibold">
                      EQUIPO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tarjetas.map((tarjeta) => {
                    const equipoNombre =
                      tarjeta.equipo_id === partido.equipo_local?.id
                        ? partido.equipo_local?.nombre
                        : partido.equipo_visitante?.nombre;
                    return (
                      <tr
                        key={tarjeta.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-2 px-3">{tarjeta.minuto}'</td>
                        <td className="py-2 px-3">
                          {tarjeta.jugadores
                            ? `${tarjeta.jugadores.primer_nombre} ${tarjeta.jugadores.primer_apellido}`
                            : "Desconocido"}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={
                              tarjeta.tipo === "AMARILLA"
                                ? "text-yellow-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {tarjeta.tipo}
                          </span>
                        </td>
                        <td className="py-2 px-3">{equipoNombre}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Substitutions */}
      <Card className="print:border-2 print:shadow-none">
        <CardHeader className="bg-gray-100 print:bg-gray-50">
          <CardTitle className="text-xl print:text-lg">Cambios</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {cambios.length === 0 ? (
            <p className="text-gray-500 italic">
              No se registraron cambios en este partido
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="text-left py-2 px-3 font-semibold">MIN</th>
                    <th className="text-left py-2 px-3 font-semibold">
                      SALE → ENTRA
                    </th>
                    <th className="text-left py-2 px-3 font-semibold">
                      EQUIPO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cambios.map((cambio) => {
                    const equipoNombre =
                      cambio.equipo_id === partido.equipo_local?.id
                        ? partido.equipo_local?.nombre
                        : partido.equipo_visitante?.nombre;
                    return (
                      <tr
                        key={cambio.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-2 px-3">{cambio.minuto}'</td>
                        <td className="py-2 px-3">
                          <span className="text-red-600">
                            ↓{" "}
                            {cambio.jugador_sale
                              ? `${cambio.jugador_sale.primer_nombre} ${cambio.jugador_sale.primer_apellido}`
                              : "?"}
                          </span>
                          <span className="mx-2">→</span>
                          <span className="text-green-600">
                            ↑{" "}
                            {cambio.jugador_entra
                              ? `${cambio.jugador_entra.primer_nombre} ${cambio.jugador_entra.primer_apellido}`
                              : "?"}
                          </span>
                        </td>
                        <td className="py-2 px-3">{equipoNombre}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signature Section - For print */}
      <div className="mt-12 print:block hidden">
        <div className="grid grid-cols-3 gap-8 pt-8">
          <div className="text-center">
            <div className="border-t-2 border-black pt-2 mt-16">
              <p className="font-semibold">Árbitro</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-black pt-2 mt-16">
              <p className="font-semibold">Capitán Equipo Local</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-black pt-2 mt-16">
              <p className="font-semibold">Capitán Equipo Visitante</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - For print */}
      <div className="print:block hidden text-center text-sm text-gray-500 mt-8 pt-4 border-t">
        <p>
          Documento generado el{" "}
          {new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          - GoolStar Tournament Management System
        </p>
      </div>
    </div>
  );
}
