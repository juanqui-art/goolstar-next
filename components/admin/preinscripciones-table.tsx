"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Mail, Phone, ExternalLink, Download, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePreinscripcion, exportPreinscripcionesCSV } from "@/actions/preinscripciones";
import type { Database } from "@/types/database";

type PreinscripcionRow = Database["public"]["Tables"]["preinscripciones_torneo"]["Row"];

interface PreinscripcionesTableProps {
  preinscripciones: PreinscripcionRow[];
  torneoId?: string;
}

const estadoColors: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  contactado: "bg-blue-100 text-blue-800",
  confirmado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800",
  convertido: "bg-purple-100 text-purple-800",
};

const estadoLabels: Record<string, string> = {
  pendiente: "Pendiente",
  contactado: "Contactado",
  confirmado: "Confirmado",
  rechazado: "Rechazado",
  convertido: "Convertido",
};

export function PreinscripcionesTable({
  preinscripciones: initialPreinscripciones,
  torneoId,
}: PreinscripcionesTableProps) {
  const [preinscripciones, setPreinscripciones] = useState(initialPreinscripciones);
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  // Filter preinscripciones
  const filteredPreinscripciones =
    filterEstado === "all"
      ? preinscripciones
      : preinscripciones.filter((p) => p.estado === filterEstado);

  // Handle estado change
  const handleEstadoChange = async (id: string, nuevoEstado: string) => {
    const result = await updatePreinscripcion(id, {
      estado: nuevoEstado,
      fecha_contacto: nuevoEstado !== "pendiente" ? new Date() : undefined,
    });

    if (result.success) {
      setPreinscripciones((prev) =>
        prev.map((p) => (p.id === id ? result.data : p)),
      );
    }
  };

  // Handle CSV export
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportPreinscripcionesCSV(torneoId);

      if (result.success) {
        // Download CSV
        const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `preinscripciones_${new Date().toISOString().split("T")[0]}.csv`,
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Pre-inscripciones</CardTitle>
            <CardDescription>
              {filteredPreinscripciones.length} de {preinscripciones.length} registros
            </CardDescription>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Filter by estado */}
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="contactado">Contactados</SelectItem>
                <SelectItem value="confirmado">Confirmados</SelectItem>
                <SelectItem value="convertido">Convertidos</SelectItem>
                <SelectItem value="rechazado">Rechazados</SelectItem>
              </SelectContent>
            </Select>

            {/* Export CSV */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exportando..." : "Exportar CSV"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>UTM Source</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPreinscripciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No hay pre-inscripciones para mostrar
                  </TableCell>
                </TableRow>
              ) : (
                filteredPreinscripciones.map((preinscripcion) => (
                  <TableRow key={preinscripcion.id}>
                    {/* Nombre */}
                    <TableCell className="font-medium">
                      {preinscripcion.nombre_completo}
                    </TableCell>

                    {/* Contacto */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <a
                          href={`mailto:${preinscripcion.email}`}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <Mail className="h-3 w-3" />
                          {preinscripcion.email}
                        </a>
                        <a
                          href={`https://wa.me/${preinscripcion.telefono.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-green-600 hover:underline"
                        >
                          <Phone className="h-3 w-3" />
                          {preinscripcion.telefono}
                        </a>
                      </div>
                    </TableCell>

                    {/* UTM Source */}
                    <TableCell>
                      {preinscripcion.utm_source ? (
                        <div className="flex flex-col gap-1 text-sm">
                          <Badge variant="outline" className="w-fit">
                            {preinscripcion.utm_source}
                          </Badge>
                          {preinscripcion.utm_campaign && (
                            <span className="text-xs text-muted-foreground">
                              {preinscripcion.utm_campaign}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      <Select
                        value={preinscripcion.estado}
                        onValueChange={(value) =>
                          handleEstadoChange(preinscripcion.id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            <Badge
                              className={estadoColors[preinscripcion.estado] || ""}
                            >
                              {estadoLabels[preinscripcion.estado]}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="contactado">Contactado</SelectItem>
                          <SelectItem value="confirmado">Confirmado</SelectItem>
                          <SelectItem value="convertido">Convertido</SelectItem>
                          <SelectItem value="rechazado">Rechazado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Fecha */}
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(preinscripcion.created_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </TableCell>

                    {/* Acciones */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0"
                      >
                        <a
                          href={`https://wa.me/${preinscripcion.telefono.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir WhatsApp"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
