import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Setup fonts
import { Outfit } from 'next/font/google';
import { Lora } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata = {
  title: 'NextJs Starter built with JavaScript',
  description:
    'A clean and modern blog built with Next.js and Shadcn.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`min-h-screen flex flex-col ${outfit.variable} ${lora.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Header option={1} />

        <main className='flex-1 w-full'>
          <AuthProvider>{children}</AuthProvider>
        </main>

        <Footer />
      </body>
    </html>
  );
}
