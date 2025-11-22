import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentoViewerProps {
  documentoUrl: string;
  jugadorNombre: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export function DocumentoViewer({
  documentoUrl,
  jugadorNombre,
  onApprove,
  onReject,
}: DocumentoViewerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documento - {jugadorNombre}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-[3/4] w-full max-w-md mx-auto bg-gray-100 rounded border">
          {documentoUrl ? (
            <Image
              src={documentoUrl}
              alt="Documento"
              fill
              className="object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No hay documento disponible</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <Button variant="default" onClick={onApprove}>
            Aprobar Documento
          </Button>
          <Button variant="destructive" onClick={onReject}>
            Rechazar Documento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
