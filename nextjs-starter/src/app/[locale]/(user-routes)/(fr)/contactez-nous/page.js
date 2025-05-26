import { loadTranslation } from '@/cms-core/lib/i18n/loadTranslation';
import { locales } from '@/cms-core/lib/i18n/config';
import { notFound } from 'next/navigation';

export default async function ContactFRPage({ params }) {
  const { locale } = await Promise.resolve(params);
  if (!locales.includes(locale)) notFound();

  const t = await loadTranslation(locale, 'pages');
  const contactezNous = t.contactezNous || {};

  return (
    <section className='container mx-auto py-16 px-4'>
      <h1 className='text-4xl font-bold mb-4'>
        French {contactezNous.title || 'Contact Us 1'}
      </h1>
      <p className='text-muted-foreground'>
        {contactezNous.description || 'Contact us here.'}
      </p>
    </section>
  );
}
