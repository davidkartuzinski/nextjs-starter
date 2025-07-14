import { NextResponse } from 'next/server';
import { createServerComponentClient } from '../../../cms-core/lib/database/supabase/server';

export async function GET() {
  const supabase = createServerComponentClient();

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(request) {
  const supabase = createServerComponentClient();
  const { title } = await request.json();

  const { data, error } = await supabase
    .from('todos')
    .insert([{ title }])
    .select();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data[0]);
}
