import { loadTranslation } from '../../../../../cms-core/lib/i18n/loadTranslation';
import { locales } from '../../../../../cms-core/lib/i18n/config';
import { notFound } from 'next/navigation';

export default async function ContactPage({ params }) {
  const { locale } = await Promise.resolve(params);
  if (!locales.includes(locale)) notFound();

  const t = await loadTranslation(locale, 'pages');

  // Get the appropriate translation key based on locale
  let translationKey = 'contact';
  if (locale === 'es') translationKey = 'contacto';
  if (locale === 'fr') translationKey = 'contactezNous';

  const contactData = t[translationKey] || {};

  return (
    <section className='container mx-auto py-16 px-4'>
      <h1 className='text-4xl font-bold mb-4'>
        {contactData.title || 'Contact Us'}
      </h1>
      <p className='text-muted-foreground'>
        {contactData.description || 'Contact us here.'}
      </p>
    </section>
  );
}
