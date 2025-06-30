import { loadTranslation } from '@/cms-core/lib/i18n/loadTranslation';
import { resolveTranslationKey } from '@/cms-core/lib/i18n/route-utils';
import { notFound } from 'next/navigation';
import { locales } from '@/cms-core/lib/i18n/config';
import { localizedSlugs } from '@/user-content/routes/slugs';

export default async function Page({ params }) {
  const { locale, slug } = await Promise.resolve(params);

  if (!locales.includes(locale)) notFound();

  const translationKey = resolveTranslationKey(locale, slug);
  if (!translationKey) notFound();

  const t = await loadTranslation(locale, translationKey);

  return (
    <section className='container mx-auto py-16 px-4'>
      <h1 className='text-4xl font-bold mb-4'>
        {t.title || 'Missing Title'}
      </h1>
      <p className='text-muted-foreground'>
        {t.description || 'Missing Description'}
      </p>
    </section>
  );
}

// 👇 Required so Next knows what URLs to generate at build time
export async function generateStaticParams() {
  const slugs = Object.keys(localizedSlugs);
  const locales = ['en', 'fr', 'es'];

  return locales.flatMap((locale) =>
    slugs.map((key) => ({
      locale,
      slug: localizedSlugs[key][locale],
    }))
  );
}

// 👇 Optional: prevents warnings about missing metadata
export async function generateMetadata({ params }) {
  const { slug } = await Promise.resolve(params);
  return {
    title: `${slug} | MySite`,
  };
}
