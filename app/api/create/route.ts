import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface User {
  full_name: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const supabase = createClient();

  // Obtener los datos del cuerpo de la solicitud
  const userData: User = await request.json();

  console.log('Datos recibidos:', userData);

  // Crear el usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email,
    email_confirm: true,
    password: userData.password,
  });

  if (authError) {
    console.error('Error al crear el usuario en Supabase Auth:', authError);
    return NextResponse.json({ message: 'Error al crear el usuario en Supabase Auth', error: authError }, { status: 400 });
  }

  const userId = authData.user.id;

  // Verificar el valor de userData.full_name antes de la inserción
  console.log('Nombre completo antes de la inserción:', userData.full_name);

  // Insertar en la tabla user_profiles
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .insert([
      {
        id: userId,
        full_name: userData.full_name, // Asegúrate de que el nombre de la columna es correcto
        email: userData.email,
        password: userData.password,
      },
    ]);

  if (profileError) {
    console.error('Error al insertar en la tabla user_profiles:', profileError);
    return NextResponse.json({ message: 'Error al insertar en la tabla user_profiles', error: profileError }, { status: 400 });
  }

  console.log('Usuario registrado y perfil creado:', profileData);
  return NextResponse.json({ message: 'Usuario registrado exitosamente y perfil creado' });
}
