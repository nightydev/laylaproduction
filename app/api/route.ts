import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();

  const body = await request.json();
  const { folder, url, fileName } = body;

  if (!folder || !url || !fileName) {
    return NextResponse.json({ error: 'Missing folder, URL, or fileName' }, { status: 400 });
  }

  const fullName = await getUserFullName(supabase);

  try {
    const { data, error } = await supabase
      .from('uploads')
      .insert([{ folder: folder, url: url, file_name: fileName, full_name: fullName }]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  }
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

export async function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

export async function PUT() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

export async function DELETE() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}
