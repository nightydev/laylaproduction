'use client';

import { useState } from 'react';
import Modal from 'react-modal';
import { supabase } from '@/utils/supabase/server-client';

interface Historiadominio {
  id: string;
  fechaemision: string;
  ciudad: string;
  noinscripcion: string;
  clavecatastral: string;
  historia?: string;
  linderos?: string;
  observaciones?: string;
  solvencia?: string;
  razon?: string;
}

const CedulaSearch = () => {
  const [cedula, setCedula] = useState('');
  const [historial, setHistorial] = useState<Historiadominio[] | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Historiadominio | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSearch = async () => {
    setError('');
    setSuccess('');
    setHistorial(null);

    const { data: citizen, error: citizenError } = await supabase
      .from('citizens')
      .select('*')
      .eq('cedula', cedula)
      .single();

    if (citizenError || !citizen) {
      setError('Ciudadano no encontrado');
      return;
    }

    const { data: historials, error: historialError } = await supabase
      .from('historiadominio')
      .select('*')
      .eq('idciudadano', citizen.id);

    if (historialError) {
      setError('Error al recuperar el historial');
      return;
    }

    setHistorial(historials || []);
  };

  const handleEdit = (record: Historiadominio) => {
    setSelectedRecord(record);
  };

  const handleSave = async () => {
    if (selectedRecord) {
      const { data, error } = await supabase
        .from('historiadominio')
        .update({
          historia: selectedRecord.historia,
          linderos: selectedRecord.linderos,
          observaciones: selectedRecord.observaciones,
          solvencia: selectedRecord.solvencia,
          razon: selectedRecord.razon,
        })
        .eq('id', selectedRecord.id)
        .select();

      if (error) {
        setError('Error al guardar los cambios');
        return;
      }

      if (data && data.length > 0) {
        setHistorial(historial?.map(h => (h.id === selectedRecord.id ? data[0] : h)) || []);
        setSelectedRecord(null);
        setSuccess('Cambios guardados exitosamente');
      } else {
        setError('No se encontraron datos actualizados');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">
          Ingresar Cédula:
        </label>
        <input
          type="text"
          id="cedula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          onClick={handleSearch}
          className="mt-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          Buscar
        </button>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      {historial && historial.length > 0 && (
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Emisión</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Inscripción</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clave Catastral</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {historial.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.fechaemision}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.ciudad}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.noinscripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.clavecatastral}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {historial && historial.length === 0 && (
        <div className="mt-4 text-gray-700">No se encontraron registros de historial para este ciudadano.</div>
      )}

      <Modal
        isOpen={!!selectedRecord}
        onRequestClose={() => setSelectedRecord(null)}
        className="bg-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto mt-20"
        ariaHideApp={false}
      >
        {selectedRecord && (
          <div>
            <h2 className="text-xl font-bold mb-4">Editar Registro</h2>
            <label className="block text-sm font-medium text-gray-700">Historia</label>
            <textarea
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedRecord.historia}
              onChange={(e) => setSelectedRecord({ ...selectedRecord, historia: e.target.value })}
            />
            <label className="block text-sm font-medium text-gray-700">Linderos</label>
            <textarea
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedRecord.linderos}
              onChange={(e) => setSelectedRecord({ ...selectedRecord, linderos: e.target.value })}
            />
            <label className="block text-sm font-medium text-gray-700">Observaciones</label>
            <textarea
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedRecord.observaciones}
              onChange={(e) => setSelectedRecord({ ...selectedRecord, observaciones: e.target.value })}
            />
            <label className="block text-sm font-medium text-gray-700">Solvencia</label>
            <textarea
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedRecord.solvencia}
              onChange={(e) => setSelectedRecord({ ...selectedRecord, solvencia: e.target.value })}
            />
            <label className="block text-sm font-medium text-gray-700">Razón</label>
            <textarea
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedRecord.razon}
              onChange={(e) => setSelectedRecord({ ...selectedRecord, razon: e.target.value })}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                className="mr-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CedulaSearch;
