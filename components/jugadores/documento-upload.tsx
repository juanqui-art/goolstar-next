"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DocumentoUploadProps {
  jugadorId: string;
  onUploadComplete?: () => void;
}

export function DocumentoUpload({
  jugadorId,
  onUploadComplete,
}: DocumentoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    // TODO: Implement file upload to Supabase Storage
    // TODO: Create documento record in database
    console.log("Uploading file:", file.name, "for jugador:", jugadorId);

    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setFile(null);
      if (onUploadComplete) {
        onUploadComplete();
      }
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir Documento</CardTitle>
        <CardDescription>
          Sube el documento de identidad del jugador (cédula, pasaporte, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="documento">Seleccionar archivo</Label>
          <Input
            id="documento"
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        {file && (
          <div className="text-sm text-gray-600">
            Archivo seleccionado:{" "}
            <span className="font-medium">{file.name}</span>
          </div>
        )}

        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? "Subiendo..." : "Subir Documento"}
        </Button>
      </CardContent>
    </Card>
  );
}
