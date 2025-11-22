import { Suspense } from "react";
import { DocumentoQueue } from "@/components/admin/documento-queue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDocumentosPendientes } from "@/lib/data";

export default function DocumentosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verificación de Documentos</h1>
        <p className="text-gray-600">
          Aprueba o rechaza documentos de jugadores
        </p>
      </div>

      <Suspense fallback={<DocumentosLoadingSkeleton />}>
        <DocumentosList />
      </Suspense>
    </div>
  );
}

async function DocumentosList() {
  // NO cached - always fresh data (critical)
  const rawDocumentos = await getDocumentosPendientes();

  // Transform data to match DocumentoQueue expected format
  const documentos = rawDocumentos.map((doc: any) => ({
    id: doc.id,
    jugador: doc.jugadores?.nombre || "N/A",
    equipo: doc.equipos?.nombre || "N/A",
    tipo: doc.tipo || "N/A",
    fecha_subida: doc.fecha_subida || "",
    estado: doc.estado as "pendiente" | "aprobado" | "rechazado",
  }));

  return (
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
  );
}

function DocumentosLoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cola de Documentos</CardTitle>
        <CardDescription>Cargando documentos pendientes...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
