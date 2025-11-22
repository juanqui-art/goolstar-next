import { DocumentoQueue } from "@/components/admin/documento-queue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Documento {
  id: string;
  jugador: string;
  equipo: string;
  tipo: string;
  fecha_subida: string;
  estado: "pendiente" | "aprobado" | "rechazado";
}

export const dynamic = "force-dynamic";

export default function DocumentosPage() {
  // TODO: Replace with getDocumentosPendientes() Server Action
  const documentos: Documento[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verificación de Documentos</h1>
        <p className="text-gray-600">
          Aprueba o rechaza documentos de jugadores
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cola de Documentos</CardTitle>
          <CardDescription>
            {documentos.length} documento{documentos.length !== 1 ? "s" : ""}{" "}
            pendiente{documentos.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentoQueue documentos={documentos} />
        </CardContent>
      </Card>
    </div>
  );
}
