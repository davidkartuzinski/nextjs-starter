import { notFound } from 'next/navigation';
import { locales } from '@/cms-core/lib/i18n/config';

import Header from '@/cms-core/components/layout/Header';
import Footer from '@/cms-core/components/layout/Footer';
import { AuthProvider } from '@/cms-core/contexts/auth-context';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await Promise.resolve(params);

  if (!locales.includes(locale)) notFound();

  return (
    <>
      <Header
        locale={locale}
        menuOption={2}
        mobileOption={2}
        labelLanguageOption={2}
      />
      <main className='flex-1 w-full'>
        <AuthProvider>{children}</AuthProvider>
      </main>
      <Footer />
    </>
  );
}
