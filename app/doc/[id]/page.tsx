import { createClient } from '@/utils/supabase/server';

interface Historiadominio {
  id: string;
  fechaemision: string;
  fechainscripcion?: string;
  fechaotorgamiento?: string;
  folio?: string;
  idciudadano?: string;
  idotorgante?: string;
  ubicacion?: string;
  norepertorio?: string;
  notaria?: string;
  tomo?: string;
  ciudad: string;
  noinscripcion: string;
  clavecatastral: string;
  historia?: string;
  linderos?: string;
  observaciones?: string;
  solvencia?: string;
  razon?: string;
  registrador?: string;
}

function formatearFecha(fecha: any) {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const fechaObj = new Date(fecha + 'T00:00:00-05:00');
  const dia = fechaObj.getDate();
  const mes = meses[fechaObj.getMonth()];
  const año = fechaObj.getFullYear();

  return `${dia} de ${mes} del ${año}`;
}

export default async function docPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('historiadominio')
    .select('*')
    .eq('id', params.id);

  if (error) {
    console.error('Error fetching user details:', error.message);
    return <div>Error al obtener los detalles del usuario</div>;
  }

  if (!data || data.length === 0) {
    return <div>No se encontraron datos para el usuario con ID: {params.id}</div>;
  }

  const historia: Historiadominio = data[0];

  const { data: otorgante, error: otorganteError } = await supabase
    .from('citizens')
    .select('names, lastnames, cedula')
    .eq('id', historia.idotorgante)
    .single();

  if (otorganteError || !otorgante) {
    console.log('La cédula del ciudadano otorgante no existe.');
    return;
  }

  return (
    <div>

      <div className="max-w-4xl mx-auto p-10 font-serif text-sm">
        <img src='https://xbtwhblktssqdkhzcmkz.supabase.co/storage/v1/object/public/img/Dise_o_sin_t_tulo.png' alt='logo1' />
        <h1 className="text-center text-lg font-bold mb-2 uppercase">Certificado de Historia de Dominio</h1>

        <div className="text-left mb-4">
          <p><strong>Fecha de Emisión:</strong> {formatearFecha(historia.fechaemision)}</p>
          <p><strong>Ciudad:</strong> {historia.ciudad}</p>
          <p><strong>Clave Catastral:</strong> {historia.clavecatastral}</p>
        </div>

        <section className="mb-6">
          <h2 className="font-bold uppercase">1.- Interviniente(s):</h2>
          <table className="table-auto w-full mt-2 mb-4 border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Cédula / RUC / Documento</th>
                <th className="border px-4 py-2 text-left">Nombre</th>
                <th className="border px-4 py-2 text-left">En calidad de:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">{otorgante.cedula}</td>
                <td className="border px-4 py-2">{otorgante.names} {otorgante.lastnames}</td>
                <td className="border px-4 py-2">Propietario/a</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mb-6">
          <h2 className="font-bold uppercase">2.- Detalles Registrales:</h2>
          <ul className="mt-2 mb-4 list-disc list-inside">
            <li><strong>Inscrita el:</strong> {historia.fechainscripcion}</li>
            <li><strong>Folio:</strong> {historia.folio}</li>
            <li><strong>Tomo:</strong> {historia.tomo}</li>
            <li><strong>No. Inscripción:</strong> {historia.noinscripcion}</li>
            <li><strong>No. Repertorio:</strong> {historia.norepertorio}</li>
            <li><strong>Notaría/Juzgado/Institución:</strong> {historia.notaria}</li>
            <li><strong>Fecha de Otorgamiento/Providencia/Resolución:</strong> {historia.fechaotorgamiento}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="font-bold uppercase">3.- Ubicación:</h2>
          <p className="mt-2 mb-4">{historia.ubicacion}</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold uppercase">4.- Historia:</h2>
          <p className="mt-2 mb-4 text-justify">{historia.historia}</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold uppercase">5.- Linderos y Medidas:</h2>
          <p className="mt-2 mb-4 text-justify">{historia.linderos}</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold uppercase">6.- Observaciones:</h2>
          <p className="mt-2 mb-4">{historia.observaciones}</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold uppercase">7.- Solvencia:</h2>
          <p className="mt-2">{historia.solvencia}</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold uppercase">8.- Razón:</h2>
          <p className="mt-2">{historia.razon}</p>
        </section>

        <footer className="mt-10">
          <div className="text-center mb-4">
            <p className="">{historia.ciudad}, {formatearFecha(historia.fechaemision)}</p>
          </div>

          <div className="flex flex-col justify-between items-centers pb-4 pt-4">
            <div className="text-center">
              <p className="uppercase font-bold text-sm">{historia.registrador}</p>
              <p className="uppercase font-bold text-sm">Registrador/a de la propiedad y mercantil del Cantón Sucre</p>
            </div>
            <div className="flex flex-col justify-center text-center text-xs">
              <p className='mb-1'>Los datos consignados errónea o dolosamente eximen de responsabilidad al certificante.</p>
              <hr />
              <p className='text-left mt-1'>Cualquier enmendadura o alteración a este documento lo invalida. El interesado debe comunicar cualquier falla o error en este documento al Registrador o a sus asesores.</p>
            </div>
          </div>
          <div className='flex'>
            <div className='w-1/2'></div>
            <div className="flex flex-col justify-between mt-4 text-xs text-center w-1/2">
              <div className="border-2 border-orange-600 p-2">
                <p>El interesado debe comunicar cualquier falla o error en este documento al Registrador(a) o a sus asesores.</p>
                <p className="font-bold">DOCUMENTO VÁLIDO POR 30 DÍAS</p>
              </div>
            </div>
          </div>
        </footer>

        <img src='https://xbtwhblktssqdkhzcmkz.supabase.co/storage/v1/object/public/img/Agregar_un_subt_tulo.png' alt='logo2' />
      </div>
    </div>
  );
}