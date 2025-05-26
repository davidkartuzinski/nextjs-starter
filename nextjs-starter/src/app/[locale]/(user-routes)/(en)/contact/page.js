import { loadTranslation } from '@/cms-core/lib/i18n/loadTranslation';
import { locales } from '@/cms-core/lib/i18n/config';
import { notFound } from 'next/navigation';

export default async function ContactPage({ params }) {
  const { locale } = await Promise.resolve(params);
  if (!locales.includes(locale)) notFound();

  const t = await loadTranslation(locale, 'pages');
  const contact = t.contact || {};

  return (
    <section className='container mx-auto py-16 px-4'>
      <h1 className='text-4xl font-bold mb-4'>
        ENGLISH {contact.title || 'Contact Us'}
      </h1>
      <p className='text-muted-foreground'>
        {contact.description || 'Contact us here.'}
      </p>
    </section>
  );
}
