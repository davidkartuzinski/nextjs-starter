'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase/client';
const supabase = createClientComponentClient();

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className='max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow'>
      <h2 className='text-2xl font-bold mb-4'>Sign In</h2>
      <form onSubmit={handleLogin} className='space-y-4'>
        <input
          type='email'
          placeholder='Email'
          className='w-full border p-2 rounded'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          className='w-full border p-2 rounded'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <button
          type='submit'
          className='w-full bg-black text-white p-2 rounded'
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
