'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/server-client';

type FormData = {
  fechaemision: string;
  ciudad: string;
  clavecatastral: string;
  idciudadano: string;
  fechainscripcion: string;
  noinscripcion: string;
  notaria: string;
  fechaotorgamiento: string;
  folio: string;
  norepertorio: string;
  tomo: string;
  ubicacion: string;
  historia: string;
  linderos: string;
  observaciones: string;
  solvencia: string;
  razon: string;
  constitucion: string;
  idotorgante?: string;
};

export default function CertificateForm() {
  const [formData, setFormData] = useState<FormData>({
    fechaemision: '',
    ciudad: '',
    clavecatastral: '',
    idciudadano: '',
    fechainscripcion: '',
    noinscripcion: '',
    notaria: '',
    fechaotorgamiento: '',
    folio: '',
    norepertorio: '',
    tomo: '',
    ubicacion: '',
    historia: '',
    linderos: '',
    observaciones: '',
    solvencia: '',
    razon: '',
    constitucion: '',
  });

  const [cedulaFavorecido, setCedulaFavorecido] = useState<string>('');
  const [cedulaOtorgante, setCedulaOtorgante] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCedulaFavorecidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCedulaFavorecido(e.target.value);
  };

  const handleCedulaOtorganteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCedulaOtorgante(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Verificar la cédula del ciudadano favorecido
    const { data: citizen, error: citizenError } = await supabase
      .from('citizens')
      .select('id')
      .eq('cedula', cedulaFavorecido)
      .single();

    if (citizenError || !citizen) {
      setError('La cédula del ciudadano favorecido no existe.');
      return;
    }

    // Verificar la cédula del ciudadano otorgante
    const { data: otorgante, error: otorganteError } = await supabase
      .from('citizens')
      .select('id')
      .eq('cedula', cedulaOtorgante)
      .single();

    if (otorganteError || !otorgante) {
      setError('La cédula del ciudadano otorgante no existe.');
      return;
    }

    // Agregar los ids al formulario
    const newFormData = { ...formData, idciudadano: citizen.id, idotorgante: otorgante.id };

    // Insertar los datos en la tabla historiadominio
    const { error: insertError } = await supabase
      .from('historiadominio')
      .insert(newFormData);

    if (insertError) {
      setError('Hubo un error al registrar los datos.');
      return;
    }

    setSuccess(true);
    setFormData({
      fechaemision: '',
      ciudad: '',
      clavecatastral: '',
      idciudadano: '',
      fechainscripcion: '',
      noinscripcion: '',
      notaria: '',
      fechaotorgamiento: '',
      folio: '',
      norepertorio: '',
      tomo: '',
      ubicacion: '',
      historia: '',
      linderos: '',
      observaciones: '',
      solvencia: '',
      razon: '',
      constitucion: '',
    });
    setCedulaFavorecido('');
    setCedulaOtorgante('');
  };

  return (
    <div className="max-w mx-auto p-5 bg-white relative">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Registro exitoso</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cédula del ciudadano favorecido:</label>
          <input
            type="text"
            name="cedulaFavorecido"
            value={cedulaFavorecido}
            onChange={handleCedulaFavorecidoChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cédula del ciudadano otorgante:</label>
          <input
            type="text"
            name="cedulaOtorgante"
            value={cedulaOtorgante}
            onChange={handleCedulaOtorganteChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Emisión:</label>
          <input
            type="date"
            name="fechaemision"
            value={formData.fechaemision}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ciudad:</label>
          <input
            type="text"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Clave Catastral:</label>
          <input
            type="text"
            name="clavecatastral"
            value={formData.clavecatastral}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Inscripción:</label>
          <input
            type="date"
            name="fechainscripcion"
            value={formData.fechainscripcion}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">No. de Inscripción:</label>
          <input
            type="text"
            name="noinscripcion"
            value={formData.noinscripcion}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Notaría:</label>
          <input
            type="text"
            name="notaria"
            value={formData.notaria}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Otorgamiento:</label>
          <input
            type="date"
            name="fechaotorgamiento"
            value={formData.fechaotorgamiento}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Folio:</label>
          <input
            type="text"
            name="folio"
            value={formData.folio}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">No. Repertorio:</label>
          <input
            type="text"
            name="norepertorio"
            value={formData.norepertorio}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tomo:</label>
          <input
            type="text"
            name="tomo"
            value={formData.tomo}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ubicación:</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Historia:</label>
          <input
            type="text"
            name="historia"
            value={formData.historia}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Linderos:</label>
          <input
            type="text"
            name="linderos"
            value={formData.linderos}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Observaciones:</label>
          <input
            type="text"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Solvencia:</label>
          <input
            type="text"
            name="solvencia"
            value={formData.solvencia}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Razón:</label>
          <input
            type="text"
            name="razon"
            value={formData.razon}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Constitución (Omitir si no posee):</label>
          <input
            type="text"
            name="constitucion"
            value={formData.constitucion}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button type="submit" className="col-span-3 w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Registrar
        </button>
      </form>
    </div>
  );
}
