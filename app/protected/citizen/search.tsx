'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/server-client';

type Citizen = {
  cedula: string;
  lastnames: string;
  names: string;
  phone: string;
  email: string;
  address: string;
};

const CitizenSearch = () => {
  const [cedula, setCedula] = useState('');
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCedula(e.target.value);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setCitizen(null);

    const { data, error } = await supabase
      .from('citizens')
      .select('*')
      .eq('cedula', cedula)
      .single();

    setLoading(false);

    if (error || !data) {
      setNotFound(true);
    } else {
      setCitizen(data);
    }
  };

  return (
    <div className="flex items-center justify-center w-full flex-col">
      <form onSubmit={handleSearch} className="bg-white p-6 rounded shadow-md w-full max-w-lg mb-4">
        <div className="mb-4">
          <label htmlFor="cedula" className="block text-gray-700">
            Cédula
          </label>
          <input
            type="text"
            id="cedula"
            name="cedula"
            value={cedula}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar Ciudadano'}
        </button>
      </form>

      {notFound && (
        <p className="text-red-500">No se encontró el usuario</p>
      )}

      {citizen && (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">Datos del Ciudadano</h2>
          <p><strong>Cédula:</strong> {citizen.cedula}</p>
          <p><strong>Apellidos:</strong> {citizen.lastnames}</p>
          <p><strong>Nombres:</strong> {citizen.names}</p>
          <p><strong>Teléfono:</strong> {citizen.phone}</p>
          <p><strong>Email:</strong> {citizen.email}</p>
          <p><strong>Dirección:</strong> {citizen.address}</p>
        </div>
      )}
    </div>
  );
};

export default CitizenSearch;
