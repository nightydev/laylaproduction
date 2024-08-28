'use client';

import { useState, useEffect } from 'react';

interface Upload {
  file_name: string;
  created_at: string;
  folder: string;
  url: string;
  full_name: string;
}

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Upload[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const response = await fetch(`/api/search?query=${searchTerm}`);
      const data: Upload[] = await response.json();
      setResults(data);
    };

    if (searchTerm) {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-300 mb-4">
        <h1 className="text-3xl font-semibold text-gray-800">Buscar Archivo</h1>
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-2">Ingresa el nombre del archivo</label>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar archivo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
        />
      </div>

      {results.length > 0 && (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nombre del Archivo</th>
              <th className="px-4 py-2 border-b">Subido Por</th>
              <th className="px-4 py-2 border-b">Fecha de Subida</th>
              <th className="px-4 py-2 border-b">Carpeta</th>
              <th className="px-4 py-2 border-b">Enlace</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.url}>
                <td className="px-4 py-2 border-b">{result.file_name}</td>
                <td className="px-4 py-2 border-b">{result.full_name}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(result.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b">{result.folder}</td>
                <td className="px-4 py-2 border-b">
                  <a href={result.url} target="_blank" className="text-blue-500 hover:underline">
                    Ver Archivo
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}