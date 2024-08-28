'use client';

import { supabase } from "@/utils/supabase/server-client";
import { useState, useRef } from "react";

export default function ScannerForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);
      const filePath = selectedFile.name;

      const { data, error } = await supabase.storage
        .from("iafiles")
        .upload(filePath, selectedFile);

      if (error) {
        console.error("Error uploading file:", error.message);
        setUploadSuccess(false);
      } else {
        const { data: file } = await supabase.storage
          .from("iafiles")
          .getPublicUrl(data?.path);

        if (file?.publicUrl) {
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: file.publicUrl }),
          });

          if (response.ok) {
            setUploadSuccess(true);
          } else {
            setUploadSuccess(false);
          }
        }

        setSelectedFile(null);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto bg-white p-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-300 mb-4">
        <h1 className="text-3xl font-semibold text-gray-800">Subir Archivo Escaner</h1>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona un archivo</label>
        <input
          type="file"
          ref={inputRef}
          accept="application/pdf"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="p-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
        />
      </div>

      <button
        className="w-1/6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700"
        type="button"
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? 'Cargando...' : 'Subir Archivo'}
      </button>

      {uploadSuccess === true && (
        <p className="mt-4 text-green-600">Archivo subido exitosamente</p>
      )}
      {uploadSuccess === false && (
        <p className="mt-4 text-red-600">Error al subir el archivo</p>
      )}
    </div>
  );
}
