import { notFound } from 'next/navigation';
import { locales } from '@/cms-core/lib/i18n/config';
import { loadTranslation } from '@/cms-core/lib/i18n/loadTranslation';

export default async function AProposPage({ params }) {
  const { locale } = await Promise.resolve(params);
  if (!locales.includes(locale)) notFound();

  const t = await loadTranslation(locale, 'pages');
  const about = t.about || {};

  return (
    <section className='container mx-auto py-16 px-4'>
      <h1 className='text-4xl font-bold mb-4'>
        {about.title || 'À propos'}
      </h1>
      <p className='text-muted-foreground'>
        {about.description || 'En savoir plus sur nous ici.'}
      </p>
    </section>
  );
}
