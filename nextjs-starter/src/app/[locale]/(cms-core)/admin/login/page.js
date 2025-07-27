'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '../../../../../../cms-core/lib/database/supabase/client';
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
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-96'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 border rounded-md'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded-md'
              required
            />
          </div>
          {error && (
            <div className='text-red-500 text-sm'>{error}</div>
          )}
          <button
            type='submit'
            className='w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
