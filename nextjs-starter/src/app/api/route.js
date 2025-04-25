// import { NextResponse } from 'next/server';
// // import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// // import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';

// import { createServerComponentClient } from '@/lib/supabase/supabase';

// const supabase = createServerComponentClient();

// function createSupabaseClient() {
//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//     { cookies }
//   );
// }

// export async function GET(request) {
//   const supabase = createSupabaseClient();

//   const { data, error } = await supabase
//     .from('todos')
//     .select('*')
//     .order('created_at', { ascending: false });

//   if (error) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }

//   return NextResponse.json(data);
// }

// export async function POST(request) {
//   const supabase = createRouteHandlerClient({ cookies });
//   const { title } = await request.json();

//   const { data, error } = await supabase
//     .from('todos')
//     .insert([{ title }])
//     .select();

//   if (error) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }

//   return NextResponse.json(data[0]);
// }

import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase/server';

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
