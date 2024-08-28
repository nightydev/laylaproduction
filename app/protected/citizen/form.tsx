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

const CitizenForm = () => {
  const [citizen, setCitizen] = useState<Citizen>({
    cedula: '',
    lastnames: '',
    names: '',
    phone: '',
    email: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCitizen({ ...citizen, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);

    const { data, error } = await supabase
      .from('citizens')
      .insert([{ ...citizen }]);

    setLoading(false);

    if (error) {
      alert('Error inserting data');
    } else {
      setSuccessMessage('Ciudadano registrado exitosamente');
      setCitizen({
        cedula: '',
        lastnames: '',
        names: '',
        phone: '',
        email: '',
        address: ''
      });
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        {[
          { name: 'cedula', label: 'Cedula', required: true },
          { name: 'lastnames', label: 'Apellidos', required: true },
          { name: 'names', label: 'Nombres', required: true },
          { name: 'phone', label: 'Número Celular/Teléfono', required: false },
          { name: 'email', label: 'Correo Electrónico', required: false },
          { name: 'address', label: 'Dirección', required: true }
        ].map((field) => (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="block text-gray-700">
              {field.label}{field.required && <span className="text-red-500"> *</span>}
            </label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={citizen[field.name as keyof Citizen]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              required={field.required}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
          disabled={loading}
        >
          {loading ? 'Añadiendo...' : 'Añadir Ciudadano'}
        </button>

        {successMessage && (
          <p className="mt-4 text-green-500">{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default CitizenForm;
