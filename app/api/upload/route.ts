import { supabase } from '@/utils/supabase/server-client';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import path from 'path';
import fs from 'fs';
import unzipper from 'unzipper';
import TaskI from '@ilovepdf/ilovepdf-js-core/tasks/TaskI';
import openai from '@/utilsIA/config';
import encodeImageToBase64 from '@/utilsIA/imageUtils';
import { nanoid } from "nanoid";

// --------------------------------------
// FUNCIONES DE MANIPULACIÓN DE ARCHIVOS
// --------------------------------------

async function extractImages(zipPath: string) {
  const outputDir = path.join('images');

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: outputDir }))
      .on('close', () => {
        console.log('Imágenes extraídas en:', outputDir);
        resolve();
      })
      .on('error', (error) => {
        console.error('Error al extraer las imágenes:', error);
        reject(error);
      });
  });
}

async function saveImage(imageData: Uint8Array, outputPath: string) {
  return fs.promises.writeFile(outputPath, imageData);
}

async function convertAndDownload(task: TaskI, url: string) {
  try {
    await task.start();
    await task.addFile(url);
    await task.process();
    const data = await task.download();
    const outputPath = path.join('files/converted.zip');
    const isZip = (data.slice(0, 4) as Buffer).toString('hex') === '504b0304';

    if (isZip) {
      fs.writeFileSync(outputPath, data);
      await extractImages(outputPath);
    } else {
      const imageOutputPath = path.join('images', 'single_image.jpg');
      await saveImage(data, imageOutputPath);
      console.log('Imagen guardada en:', imageOutputPath);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function downloadFile(url: string, outputPath: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  await fs.promises.writeFile(outputPath, Buffer.from(buffer));
}

// --------------------------------------
// FUNCIONES DE SUBIDA A SUPABASE
// --------------------------------------

let fileUrl: string;

async function uploadToSupabase(filePath: string, bucketName: string, destinationPath: string) {
  const fileBuffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage.from(bucketName).upload(destinationPath, fileBuffer, { upsert: true, contentType: "application/pdf" });

  if (error) {
    console.error('Error uploading file to Supabase:', error);
    throw error;
  } else {
    const { data: file } = await supabase.storage
      .from("files")
      .getPublicUrl(data?.path);
    console.log('File URL:', file?.publicUrl)
    fileUrl = file?.publicUrl;
  }

  console.log('File uploaded to Supabase:', data);
  return data;
}

async function getUserFullName(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName = '';
  if (user) {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
    } else {
      fullName = profile.full_name;
    }
  }
  return fullName;
}

// --------------------------------------
// OPENAI API
// --------------------------------------

const listOptions = 'cancelacion_de_demanda, cancelacion_de_embargo, cancelacion_de_hipoteca, cancelacion_de_prenda_comercial, cancelacion_de_prohibicion, cancelacion_reserva_de_dominio, contrato_de_arriendo, dacion_de_pago, demanda, derogatoria_de_resolucion, embargo, extincion_de_patrimonio_familiar, hipoteca, inscripciones_varias, interdiccion, levantamiento_de_patrimonio_familiar, mag, prenda_de_vehiculo, prohibicion, reforma_de_estatuto, registro_propiedad, reversion_de_adjudicacion, solicitud_marginacion, sustitucion_de_fiduciaria, titulo_de_propiedad';

async function createChatCompletion(messages: object[]) {
  try {
    const response = await openai.post('/chat/completions', {
      model: 'gpt-4o',
      messages: messages,
      max_tokens: 300,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error creando chat completion:', error);
    throw error;
  }
}

async function getImages() {
  const imagesDir = path.join('images');
  const imageFiles = fs.readdirSync(imagesDir);
  const images = [];

  for (const file of imageFiles) {
    if (file !== '.gitkeep') {
      const imagePath = path.join(imagesDir, file);
      const encodedImage = encodeImageToBase64(imagePath);
      images.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${encodedImage}` } });
    }
  }

  return images;
}

// --------------------------------------
// Clear Files
// --------------------------------------

async function cleanUp() {
  const folders = ['files', 'images', 'supafile'];
  const bucketName = 'iafiles';

  // Limpiar carpetas locales
  for (const folder of folders) {
    const folderPath = path.join(folder);
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      if (file !== '.gitkeep') {
        fs.unlinkSync(path.join(folderPath, file));
      }
    }
  }

  // Limpiar bucket de Supabase
  const { data, error } = await supabase.storage.from(bucketName).list('', { limit: 100 });

  if (data) {
    for (const item of data) {
      await supabase.storage.from(bucketName).remove([item.name]);
    }
  }

  if (error) {
    console.error('Error cleaning up Supabase bucket:', error);
    throw error;
  }

  console.log('All files and folders cleaned up.');
}

// --------------------------------------
// METODOS HTTP API
// --------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    // Mostrar la URL por consola
    console.log("Uploaded file URL:", url);

    // Inicio de LovePDF
    const instance = new ILovePDFApi(process.env.LOVEPDF_PUBLIC_KEY!, process.env.LOVEPDF_SECRET_KEY!);
    const task = instance.newTask('pdfjpg');
    await convertAndDownload(task, url);

    // Operaciones de AI
    const images = await getImages();

    const aiResponse = await createChatCompletion([
      {
        role: 'user',
        content: [
          { type: 'text', text: `Analyze the images and answer only with one of the options from the following list of record types as appropriate (do not correct the words, they are written as they are): ${listOptions}` },
          ...images
        ],
      },
    ]);

    console.log('AI Response:', aiResponse);

    // Subida Final del archivo a Supabase
    const originalFileName = url.split('/').pop() || 'default.pdf';

    const pdfPath = path.join('supafile', originalFileName);
    await downloadFile(url, pdfPath);
    const filename = nanoid();
    const destinationPath = `${aiResponse}/${filename}.pdf`; // Ajusta la lógica de construcción del destino si es necesario
    await uploadToSupabase(pdfPath, 'files', destinationPath);

    // Creación de cliente de supabase para obtener el nombre completo del usuario
    const supalol = createClient();
    const fullName = await getUserFullName(supalol);
    console.log('Upload by:', fullName);

    // Limpieza de archivos
    await cleanUp();

    // Subida de registro a la base de datos
    try {
      const { data, error } = await supabase
        .from('uploads')
        .insert([{ folder: aiResponse, url: fileUrl, file_name: originalFileName, full_name: fullName }]);

      if (error) {
        throw error;
      }

      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      console.log("No se subió el registro xd, att: el programador cansado de programar")
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

export async function PUT() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

export async function DELETE() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}
