import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface Upload {
  file_name: string;
  created_at: string;
  folder: string;
  url: string;
  full_name: string;
}

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('query') || '';

  const { data, error } = await supabase
    .from('uploads')
    .select('file_name, created_at, folder, url, full_name')
    .ilike('file_name', `%${searchTerm}%`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as Upload[], { status: 200 });
}