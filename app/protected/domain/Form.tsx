'use client';

import { useState } from 'react';
import Modal from 'react-modal';
import { supabase } from '@/utils/supabase/server-client';
import jsPDF from 'jspdf';
import axios from 'axios';

function getMonthName(monthIndex: any) {
  const months = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  return months[monthIndex];
}

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

  // ....................................................
  // JUSTIFICAR
  // ....................................................

  const justifyText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    words.forEach(word => {
      const testLine = line + word + ' ';
      const testWidth = doc.getTextWidth(testLine);
      if (testWidth > maxWidth && line.length > 0) {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    });

    lines.push(line.trim());

    lines.forEach((line, index) => {
      const currentY = y + lineHeight * index;

      if (index < lines.length - 1) {
        const gap = (maxWidth - doc.getTextWidth(line)) / (line.split(' ').length - 1);
        const words = line.split(' ');
        let justifiedLine = '';

        words.forEach((word, wordIndex) => {
          if (wordIndex < words.length - 1) {
            justifiedLine += word + ' '.repeat(Math.ceil(gap / doc.getTextWidth(' ')));
          } else {
            justifiedLine += word;
          }
        });

        doc.text(justifiedLine, x, currentY);
      } else {
        doc.text(line, x, currentY);
      }
    });
  };

  // ....................................................
  // CREAR PDF
  // ....................................................

  const getImageData = async (url: string) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return base64;
  };

  const handleDownload = async (record: Historiadominio) => {

    // IMAGENES
    const imageUrl1 = 'https://xbtwhblktssqdkhzcmkz.supabase.co/storage/v1/object/public/img/Dise_o_sin_t_tulo.png';
    const logo1 = await getImageData(imageUrl1);
    const imgWidth1 = 190;
    const imgHeight1 = (imgWidth1 * 167) / 855;

    const imageUrl2 = 'https://xbtwhblktssqdkhzcmkz.supabase.co/storage/v1/object/public/img/Agregar_un_subt_tulo.png';
    const logo2 = await getImageData(imageUrl2);
    const imgWidth2 = 170;
    const imgHeight2 = (imgWidth2 * 167) / 855;

    // DATOS CIUDADANO

    const { data: otorgante, error: otorganteError } = await supabase
      .from('citizens')
      .select('names, lastnames, cedula')
      .eq('id', record.idotorgante)
      .single();

    if (otorganteError || !otorgante) {
      setError('La cédula del ciudadano otorgante no existe.');
      return;
    }

    // INICIO DEL PDF
    const doc = new jsPDF();

    doc.addImage(logo1, 'PNG', 10, 0, imgWidth1, imgHeight1);
    doc.addImage(logo2, 'PNG', 0, 260, imgWidth2, imgHeight2);

    doc.setFontSize(12);
    doc.setFont('times', 'bold');

    doc.text('CERTIFICADO DE HISTORIA DE DOMINIO', 60, 50)

    doc.setFontSize(9);
    doc.text('Fecha de Emisión:', 20, 60)
    doc.text('Ciudad:', 20, 65)
    doc.text('Clave Catastral:', 20, 70)

    doc.setFont('times', 'normal');
    justifyText(doc, record.fechaemision, 46, 60, 190, 4)
    justifyText(doc, record.ciudad, 32, 65, 190, 4)
    justifyText(doc, record.clavecatastral, 43, 70, 190, 4)

    doc.setFont('times', 'bold');
    doc.text('1.- INTERVINIENTE(S):', 20, 80)

    const headers = ['Cedula / RUC / Documento', 'Nombre', 'En calidad de:'];

    const data = [
      { 'Cedula / RUC / Documento': otorgante.cedula, 'Nombre': `${otorgante.names} ${otorgante.lastnames}`, 'En calidad de:': 'Propietario/a' },
    ];

    const config = {
      fontSize: 9,
      autoSize: false,
    };

    doc.table(20, 85, data, headers, config)

    doc.setFont('times', 'bold');
    doc.text('2.- DETALLES REGISTRALES:', 20, 115)

    doc.text('Inscrita el:', 20, 120)
    doc.text('No. Inscripción:', 20, 125)
    doc.text('Notaria/Juzgado/Institución:', 20, 130)
    doc.text('Fecha de Otorgamiento/Providencia/Resolución:', 20, 135)

    doc.text('Folio:', 115, 120)
    doc.text('No. Repertorio:', 115, 125)

    doc.text('Tomo:', 155, 120)

    doc.setFont('times', 'normal');
    justifyText(doc, record.fechainscripcion ?? '', 36, 120, 190, 4)
    justifyText(doc, record.noinscripcion, 43, 125, 190, 4)
    justifyText(doc, record.notaria ?? '', 60, 130, 190, 4)
    justifyText(doc, record.fechaotorgamiento ?? '', 87, 135, 190, 4)

    justifyText(doc, record.folio ?? '', 124, 120, 190, 4)
    justifyText(doc, record.norepertorio ?? '', 138, 125, 190, 4)
    justifyText(doc, record.tomo ?? '', 165, 120, 190, 4)


    doc.setFont('times', 'bold');
    doc.text('3.- UBICACIÓN:', 20, 150)
    doc.setFont('times', 'normal');
    justifyText(doc, record.ubicacion ?? '', 20, 155, 170, 4);

    doc.setFont('times', 'bold');
    doc.text('4.- HISTORIA:', 20, 165)
    doc.setFont('times', 'normal');
    justifyText(doc, record.historia ?? '', 20, 170, 170, 4);

    doc.setFont('times', 'bold');
    doc.text('5.- LINDEROS Y MEDIDAS:', 20, 215)
    doc.setFont('times', 'normal');
    justifyText(doc, record.linderos ?? '', 20, 220, 170, 4);

    doc.addPage();
    doc.addImage(logo1, 'PNG', 10, 0, imgWidth1, imgHeight1);
    doc.addImage(logo2, 'PNG', 0, 260, imgWidth2, imgHeight2);

    doc.setFont('times', 'bold');
    doc.text('6.- OBSERVACIONES:', 20, 45)
    doc.setFont('times', 'normal');
    justifyText(doc, record.observaciones ?? '', 20, 50, 170, 4);

    doc.setFont('times', 'bold');
    doc.text('7.- SOLVENCIA:', 20, 65)
    doc.setFont('times', 'normal');
    justifyText(doc, record.solvencia ?? '', 20, 70, 170, 4);

    doc.setFont('times', 'bold');
    doc.text('8.- RAZÓN:', 20, 85)
    doc.setFont('times', 'normal');
    justifyText(doc, record.razon ?? '', 20, 90, 170, 4);




    const today = new Date();
    const day = today.getDate();
    const month = getMonthName(today.getMonth());
    const year = today.getFullYear();
    const formattedDate = `${record.ciudad}, ${day} de ${month} ${year}`;

    doc.setFontSize(12);
    const dateX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(formattedDate)) / 2;
    doc.text(formattedDate, dateX, 170);

    doc.setFontSize(10);
    const regNameX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(record.registrador ?? ''.toUpperCase())) / 2;
    doc.text(record.registrador ?? ''.toUpperCase(), regNameX, 200);

    const regTitle = 'REGISTRADOR/A DE LA PROPIEDAD Y MERCANTIL DEL CANTÓN SUCRE';
    const regTitleX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(regTitle)) / 2;
    doc.text(regTitle, regTitleX, 205);

    doc.setFontSize(8);
    const disclaimer = 'LOS DATOS CONSIGNADOS ERRÓNEA O DOLOSAMENTE EXIMEN DE RESPONSABILIDAD AL CERTIFICANTE';
    const disclaimerX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(disclaimer)) / 2;
    doc.text(disclaimer, disclaimerX, 210);

    doc.setFontSize(6);
    const footer = 'CUALQUIER ENMENDADURA O ALTERACIÓN A ESTE DOCUMENTO LO INVALIDA, EL INTERESADO DEBE COMUNICAR CUALQUIER FALLA O ERROR AL REGISTRADOR';
    const footerX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(footer)) / 2;
    doc.text(footer, footerX, 215);




    doc.save(`CERTIFICADO_HISTORIA_DOMINIO.PDF`);
    console.log(record);

  }

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

                  <button
                    onClick={() => handleDownload(item)}
                    className="ml-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                  >
                    Descargar
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
