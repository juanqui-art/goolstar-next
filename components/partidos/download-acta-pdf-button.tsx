"use client";

import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ActaPartidoPDF } from "./acta-partido-pdf";

interface DownloadActaPDFButtonProps {
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

export function DownloadActaPDFButton({ data }: DownloadActaPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      // Generate the PDF document
      const doc = <ActaPartidoPDF data={data} />;
      const blob = await pdf(doc).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename
      const equipoLocal = data.partido.equipo_local?.nombre || "Equipo1";
      const equipoVisitante =
        data.partido.equipo_visitante?.nombre || "Equipo2";
      const fecha = data.partido.fecha
        ? new Date(data.partido.fecha).toISOString().split("T")[0]
        : "sin-fecha";

      link.download = `acta-partido-${equipoLocal}-vs-${equipoVisitante}-${fecha}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error al generar el PDF. Por favor, intente nuevamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      className="gap-2"
      size="lg"
    >
      <Download className="w-4 h-4" />
      {isGenerating ? "Generando PDF..." : "Descargar PDF"}
    </Button>
  );
}
