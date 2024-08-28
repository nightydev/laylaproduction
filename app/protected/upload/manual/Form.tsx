'use client';

import { supabase } from "@/utils/supabase/server-client";
import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";

export default function Form() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [folders, setFolders] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    const fetchFolders = async () => {
      const { data, error } = await supabase.storage.from('files').list('', {
        limit: 100,
        offset: 0,
      });

      if (error) {
        console.error("Error fetching folders:", error.message);
      } else {
        const folderNames = data?.filter(item => !item.name.includes('.')).map(folder => folder.name) || [];
        setFolders(folderNames);
        setSelectedFolder(folderNames[0] || '');
      }
    };

    fetchFolders();
  }, []);

  const handleUpload = async () => {
    if (selectedFile && selectedFolder && fileName) {
      const filename = nanoid();
      const filePath = `${selectedFolder}/${filename}.${selectedFile.name.split(".").pop()}`;

      const { data, error } = await supabase.storage
        .from("files")
        .upload(filePath, selectedFile);

      if (error) {
        console.error("Error uploading file:", error.message);
      } else {
        const { data: file } = await supabase.storage
          .from("files")
          .getPublicUrl(data?.path);
        console.log(file);
        setUploaded(file?.publicUrl);
        setSelectedFile(null);
        setFileName(""); // Limpiar el nombre del archivo
        if (inputRef.current) {
          inputRef.current.value = '';

          await fetch('/api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ folder: selectedFolder, url: file?.publicUrl, fileName }),
          });
        }
      }
    }
  };

  const formatFolderName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="container mx-auto bg-white p-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-300 mb-4">
        <h1 className="text-3xl font-semibold text-gray-800">Subir Archivo Manual</h1>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona una carpeta</label>
        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {folders.map(folder => (
            <option key={folder} value={folder}>{formatFolderName(folder)}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona un archivo</label>
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => {
            setSelectedFile(e?.target?.files?.[0] || null);
          }}
          className="p-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del archivo</label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        className="w-1/6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700"
        type="button"
        onClick={handleUpload}
      >
        Subir Archivo
      </button>

      {uploaded && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          <p>Archivo subido exitosamente | <a href={uploaded} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver Archivo</a></p>
        </div>
      )}
    </div>
  );
}