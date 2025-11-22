import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Documento {
  id: string;
  jugador: string;
  equipo: string;
  tipo: string;
  fecha_subida: string;
  estado: "pendiente" | "aprobado" | "rechazado";
}

interface DocumentoQueueProps {
  documentos: Documento[];
}

export function DocumentoQueue({ documentos }: DocumentoQueueProps) {
  if (documentos.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay documentos pendientes de verificación.
      </p>
    );
  }

  const handleApprove = (id: string) => {
    // TODO: Connect to Server Action aprobarDocumento()
    console.log("Approving document:", id);
  };

  const handleReject = (id: string) => {
    // TODO: Connect to Server Action rechazarDocumento()
    console.log("Rejecting document:", id);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Jugador</TableHead>
          <TableHead>Equipo</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Fecha Subida</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documentos.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="font-medium">{doc.jugador}</TableCell>
            <TableCell>{doc.equipo}</TableCell>
            <TableCell>{doc.tipo}</TableCell>
            <TableCell>{doc.fecha_subida}</TableCell>
            <TableCell>
              <Badge
                variant={
                  doc.estado === "aprobado"
                    ? "default"
                    : doc.estado === "rechazado"
                      ? "destructive"
                      : "outline"
                }
              >
                {doc.estado}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {doc.estado === "pendiente" && (
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleApprove(doc.id)}
                  >
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(doc.id)}
                  >
                    Rechazar
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
