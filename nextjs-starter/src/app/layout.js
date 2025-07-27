import '@/cms-core/styles/globals.css';
import { Outfit, Lora } from 'next/font/google';

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

export default function RootLayout({ children }) {
  return (
    <html>
      <body
        className={`min-h-screen flex flex-col ${outfit.variable} ${lora.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
