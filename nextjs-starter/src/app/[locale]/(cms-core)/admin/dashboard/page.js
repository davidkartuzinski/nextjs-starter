import { notFound } from 'next/navigation';
import { loadTranslation } from '../../../../../../cms-core/lib/i18n/loadTranslation';
import { locales } from '../../../../../../cms-core/lib/i18n/config';
import DashboardClient from './DashboardClient';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function DashboardPage({ params }) {
  const { locale } = await Promise.resolve(params);

  if (!locales.includes(locale)) notFound();

  const t = await loadTranslation(locale, 'dashboard');

  return <DashboardClient locale={locale} t={t} />;
}
