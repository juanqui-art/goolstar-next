import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { getPartidoActa } from "@/actions/partidos";
import { ActaPartido } from "@/components/partidos/acta-partido";
import { DownloadActaPDFButton } from "@/components/partidos/download-acta-pdf-button";
import { Button } from "@/components/ui/button";

export default async function ActaPartidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let data: Awaited<ReturnType<typeof getPartidoActa>> | undefined;
  let error: string | null = null;

  try {
    data = await getPartidoActa(id);
  } catch (e) {
    error =
      e instanceof Error ? e.message : "Error al cargar el acta del partido";
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Acta del Partido</h1>
            <p className="text-gray-600">Registro oficial del partido</p>
          </div>
          <Link href="/partidos">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </Link>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold">Acta del Partido</h1>
          <p className="text-gray-600">Registro oficial del partido</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/partidos/${id}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </Link>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </Button>
          <DownloadActaPDFButton data={data} />
        </div>
      </div>

      {/* Acta Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 print:shadow-none print:p-0">
        <ActaPartido data={data} />
      </div>
    </div>
  );
}
