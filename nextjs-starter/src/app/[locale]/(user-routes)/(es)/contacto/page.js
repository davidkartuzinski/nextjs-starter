import { loadTranslation } from '@/cms-core/lib/i18n/loadTranslation';
import { locales } from '@/cms-core/lib/i18n/config';
import { notFound } from 'next/navigation';

export default async function ContactESPage({ params }) {
  const { locale } = await Promise.resolve(params);
  if (!locales.includes(locale)) notFound();

  const t = await loadTranslation(locale, 'pages');
  const contacto = t.contacto || {};

  return (
    <section className='container mx-auto py-16 px-4'>
      <h1 className='text-4xl font-bold mb-4'>
        Spanish {contacto.title || 'Contacto 1'}
      </h1>
      <p className='text-muted-foreground'>
        {contacto.description || 'Contacto 2'}
      </p>
    </section>
  );
}
