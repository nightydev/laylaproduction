'use client';
import React, { useState } from 'react';
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

export default function Report() {
  const [cedula, setCedula] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCedula(e.target.value);
  };

  const getImageData = async (url: string) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return base64;
  };

  // FUNCIOOOOOOOOOOOOOOOOONNNNNNNNNNNN
  // FUNCIOOOOOOOOOOOOOOOOONNNNNNNNNNNN
  // FUNCIOOOOOOOOOOOOOOOOONNNNNNNNNNNN
  // FUNCIOOOOOOOOOOOOOOOOONNNNNNNNNNNN



  const justifyText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number, logo1: any, logo2: any, imgHeight2: any, imgWidth2: any, entry: any, imgWidth1: any, imgHeight1: any) => {
    const words = text.split(' ');
    let line = '';
    let lines = [];
    let twoPages = false;

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

      // Verificar si estamos en la línea 11
      if (index === 10) {  // Línea 11 es el índice 10
        console.log(`Estamos en la línea 11 en la posición Y: ${currentY}`);
      }

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

      // Detenernos si llegamos a Y = 150
      if (currentY >= 150) {
        console.log(`Se ha alcanzado la posición Y: ${currentY}`);
        twoPages = true;
      }
    });

    // FUNCION SI TIENE DOS PAGINAS 

    if (twoPages) {
      doc.addImage(logo2, 'PNG', 0, 260, imgWidth2, imgHeight2);
      doc.addPage()
      doc.setFontSize(12);
      doc.addImage(logo1, 'PNG', 10, 0, imgWidth1, imgHeight1);

      const today = new Date();
      const day = today.getDate();
      const month = getMonthName(today.getMonth());
      const year = today.getFullYear();
      const formattedDate = `${entry.ciudad}, ${day} de ${month} ${year}`;

      doc.setFontSize(12);
      const dateX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(formattedDate)) / 2;
      doc.text(formattedDate, dateX, 50);

      doc.setFontSize(10);
      const regNameX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(entry.registrador.toUpperCase())) / 2;
      doc.text(entry.registrador.toUpperCase(), regNameX, 80);

      const regTitle = 'REGISTRADOR/A DE LA PROPIEDAD Y MERCANTIL DEL CANTÓN SUCRE';
      const regTitleX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(regTitle)) / 2;
      doc.text(regTitle, regTitleX, 85);

      doc.setFontSize(8);
      const disclaimer = 'LOS DATOS CONSIGNADOS ERRÓNEA O DOLOSAMENTE EXIMEN DE RESPONSABILIDAD AL CERTIFICANTE';
      const disclaimerX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(disclaimer)) / 2;
      doc.text(disclaimer, disclaimerX, 90);

      doc.setFontSize(6);
      const footer = 'CUALQUIER ENMENDADURA O ALTERACIÓN A ESTE DOCUMENTO LO INVALIDA, EL INTERESADO DEBE COMUNICAR CUALQUIER FALLA O ERROR AL REGISTRADOR';
      const footerX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(footer)) / 2;
      doc.text(footer, footerX, 95);

      doc.addImage(logo2, 'PNG', 0, 260, imgWidth2, imgHeight2);
    }
    else {
      const today = new Date();
      const day = today.getDate();
      const month = getMonthName(today.getMonth());
      const year = today.getFullYear();
      const formattedDate = `${entry.ciudad}, ${day} de ${month} ${year}`;

      doc.setFontSize(12);
      const dateX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(formattedDate)) / 2;
      doc.text(formattedDate, dateX, 170);

      doc.setFontSize(10);
      const regNameX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(entry.registrador.toUpperCase())) / 2;
      doc.text(entry.registrador.toUpperCase(), regNameX, 200);

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

      doc.addImage(logo2, 'PNG', 0, 260, imgWidth2, imgHeight2);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Obtener datos del ciudadano favorecido
    const { data: citizen, error: citizenError } = await supabase
      .from('citizens')
      .select('id, names, lastnames, cedula')
      .eq('cedula', cedula)
      .single();

    if (citizenError || !citizen) {
      setError('La cédula del ciudadano favorecido no existe.');
      return;
    }

    // Obtener datos de la entrada en la tabla historiadominio
    const { data: dominioData, error: dominioError } = await supabase
      .from('historiadominio')
      .select('*')
      .eq('idciudadano', citizen.id);

    if (dominioError || !dominioData || dominioData.length === 0) {
      setError('No se encontró ninguna entrada en la tabla historiadominio para este ciudadano.');
      return;
    }

    // Obtener datos del otorgante
    const otorganteId = dominioData[0].idotorgante;
    const { data: otorgante, error: otorganteError } = await supabase
      .from('citizens')
      .select('names, lastnames, cedula')
      .eq('id', otorganteId)
      .single();

    if (otorganteError || !otorgante) {
      setError('La cédula del ciudadano otorgante no existe.');
      return;
    }

    const imageUrl1 = 'https://xbtwhblktssqdkhzcmkz.supabase.co/storage/v1/object/public/img/Dise_o_sin_t_tulo.png';
    const logo1 = await getImageData(imageUrl1);
    const imgWidth1 = 190;
    const imgHeight1 = (imgWidth1 * 167) / 855;

    const imageUrl2 = 'https://xbtwhblktssqdkhzcmkz.supabase.co/storage/v1/object/public/img/Agregar_un_subt_tulo.png';
    const logo2 = await getImageData(imageUrl2);
    const imgWidth2 = 170;
    const imgHeight2 = (imgWidth2 * 167) / 855;

    dominioData.forEach((entry: any, index: number) => {
      const doc = new jsPDF();

      doc.setFontSize(12);
      doc.addImage(logo1, 'PNG', 10, 0, imgWidth1, imgHeight1);
      doc.setFont('times', 'normal');

      let text = `${entry.registrador.toUpperCase()}, REGISTRADOR/A ENCARGADO/A DE LA PROPIEDAD Y MERCANTIL DEL CANTÓN SUCRE; A PETICIÓN VERBAL DE PARTE INTERESADA Y EN FORMA LEGAL, CERTIFICO QUE LA ESCRITURA QUE ANTECEDE QUEDA DEBIDAMENTE INSCRITA CON ESTA FECHA ANOTADA CON EL NÚMERO ${entry.noinscripcion} DEL REGISTRO DE PROPIEDAD DEL PRESENTE AÑO Y BAJO EL NÚMERO ${entry.norepertorio} AL FOLIO NÚMERO ${entry.folio} DEL REPERTORIO GENERAL VIGENTE, PARA SU INSCRIPCIÓN SE CUMPLIERON CON LOS REQUISITOS DE LEY. HABÍENDOSE REALIZADO LA CORRESPONDIENTE RAZÓN: ${entry.razon.toUpperCase()} UBICADO EN ${entry.ubicacion.toUpperCase()}. OTORGA ${otorgante.names.toUpperCase()} ${otorgante.lastnames.toUpperCase()} CÉDULA DE CIUDADANÍA N.-${otorgante.cedula}- A FAVOR DE ${citizen.names.toUpperCase()} ${citizen.lastnames.toUpperCase()} CÉDULA DE CIUDADANÍA N.-${citizen.cedula}-. ES CONFORME LO CERTIFICO`;
      if (entry.constitucion != '') {
        text = `${entry.registrador.toUpperCase()}, REGISTRADOR/A ENCARGADO/A DE LA PROPIEDAD Y MERCANTIL DEL CANTÓN SUCRE; A PETICIÓN VERBAL DE PARTE INTERESADA Y EN FORMA LEGAL, CERTIFICO QUE LA ESCRITURA QUE ANTECEDE QUEDA DEBIDAMENTE INSCRITA CON ESTA FECHA ANOTADA CON EL NÚMERO ${entry.noinscripcion} DEL REGISTRO DE PROPIEDAD DEL PRESENTE AÑO Y BAJO EL NÚMERO ${entry.norepertorio} AL FOLIO NÚMERO ${entry.folio} DEL REPERTORIO GENERAL VIGENTE, PARA SU INSCRIPCIÓN SE CUMPLIERON CON LOS REQUISITOS DE LEY. HABÍENDOSE REALIZADO LA CORRESPONDIENTE RAZÓN: ${entry.razon.toUpperCase()} UBICADO EN ${entry.ubicacion.toUpperCase()}. OTORGA ${otorgante.names.toUpperCase()} ${otorgante.lastnames.toUpperCase()} CÉDULA DE CIUDADANÍA N.-${otorgante.cedula}- A FAVOR DE ${citizen.names.toUpperCase()} ${citizen.lastnames.toUpperCase()} CÉDULA DE CIUDADANÍA N.-${citizen.cedula}-. Y CONSTITUCIÓN ${entry.constitucion.toUpperCase()}, EN EL INDICE RESPECTIVO.`;
      }

      const maxWidth = 190;  // Adjust this width based on your requirements
      const lineHeight = 10;
      const initialY = 50;




      // ACAAAAAAAAAAAAAAAAA
      // 7777777777777777
      // 7777777777777777777777





      justifyText(doc, text, 10, initialY, maxWidth, lineHeight, logo1, logo2, imgHeight2, imgWidth2, entry, imgWidth1, imgHeight1);

      doc.save(`RAZON_DE_INSCRIPCION_${index + 1}.PDF`);
    });

    setSuccess(true);
  };

  return (
    <div className="max-w mx-auto p-8 bg-white relative">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">PDF generado exitosamente</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cédula del ciudadano:</label>
          <input
            type="text"
            name="cedula"
            value={cedula}
            onChange={handleCedulaChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button type="submit" className="col-span-3 w-1/5 py-2 px-4 bg-gray-800 text-white font-semibold rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Generar Razón
        </button>
        <small className='text-sm text-gray-800'>Tener habilitada la descarga de multiples archivos en su navegador.</small>
      </form>
    </div>
  );
}
