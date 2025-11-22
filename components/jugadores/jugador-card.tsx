import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JugadorCardProps {
  id: string;
  nombreCompleto: string;
  numeroDorsal: number;
  equipo: string;
  posicion?: string;
  suspendido: boolean;
  tarjetasAmarillas: number;
  tarjetasRojas: number;
}

export function JugadorCard({
  id,
  nombreCompleto,
  numeroDorsal,
  equipo,
  posicion,
  suspendido,
  tarjetasAmarillas,
  tarjetasRojas,
}: JugadorCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline">#{numeroDorsal}</Badge>
              {nombreCompleto}
            </CardTitle>
            <CardDescription>{equipo}</CardDescription>
          </div>
          {suspendido && <Badge variant="destructive">Suspendido</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Posición:</span> {posicion || "N/A"}
          </p>
          <div className="flex gap-2">
            <span className="text-gray-600 font-medium">Tarjetas:</span>
            {tarjetasAmarillas > 0 && (
              <Badge variant="outline" className="bg-yellow-100">
                {tarjetasAmarillas} Amarilla{tarjetasAmarillas > 1 ? "s" : ""}
              </Badge>
            )}
            {tarjetasRojas > 0 && (
              <Badge variant="outline" className="bg-red-100">
                {tarjetasRojas} Roja{tarjetasRojas > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/jugadores/${id}`}>
          <Button variant="outline" size="sm">
            Ver Perfil
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
