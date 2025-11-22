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

interface TorneoCardProps {
  id: string;
  nombre: string;
  categoria: string;
  fechaInicio: string;
  fechaFin?: string | null;
  estado?: "activo" | "finalizado" | "proximo";
}

export function TorneoCard({
  id,
  nombre,
  categoria,
  fechaInicio,
  fechaFin,
  estado = "activo",
}: TorneoCardProps) {
  const estadoColor = {
    activo: "bg-green-100 text-green-800",
    finalizado: "bg-gray-100 text-gray-800",
    proximo: "bg-blue-100 text-blue-800",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{nombre}</CardTitle>
            <CardDescription>{categoria}</CardDescription>
          </div>
          <Badge className={estadoColor[estado]}>
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Inicio:</span> {fechaInicio}
          </p>
          {fechaFin && (
            <p className="text-gray-600">
              <span className="font-medium">Fin:</span> {fechaFin}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/torneos/${id}`}>
          <Button variant="outline" size="sm">
            Ver Detalles
          </Button>
        </Link>
        <Link href={`/torneos/${id}/tabla`}>
          <Button size="sm">Ver Tabla</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
