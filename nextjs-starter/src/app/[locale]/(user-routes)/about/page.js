import { loadTranslation } from '@/cms-core/lib/i18n/loadTranslation';
import { locales } from '@/cms-core/lib/i18n/config';
import { notFound } from 'next/navigation';

export default async function AboutPage({ params }) {
  const { locale } = await Promise.resolve(params);
  if (!locales.includes(locale)) notFound();

  const t = await loadTranslation(locale, 'pages');

  // Use 'about' key for all locales
  const aboutData = t.about || {};

  return (
    <section className='container mx-auto py-16 px-4'>
      <h1 className='text-4xl font-bold mb-4'>
        {aboutData.title || 'About Us'}
      </h1>
      <p className='text-muted-foreground'>
        {aboutData.description ||
          'We are excited to share our story with you.'}
      </p>
    </section>
  );
}
