import { defaultLocale } from './config';

// Import all translation files statically
import enPages from '@/user-content/translations/en/pages.json';
import esPages from '@/user-content/translations/es/pages.json';
import frPages from '@/user-content/translations/fr/pages.json';

import enAbout from '@/user-content/translations/en/about.json';
import esAbout from '@/user-content/translations/es/about.json';
import frAbout from '@/user-content/translations/fr/about.json';

import enContact from '@/user-content/translations/en/contact.json';
import esContact from '@/user-content/translations/es/contact.json';
import frContact from '@/user-content/translations/fr/contact.json';

import enDashboard from '@/cms-core/translations/en/dashboard.json';
import esDashboard from '@/cms-core/translations/es/dashboard.json';
import frDashboard from '@/cms-core/translations/fr/dashboard.json';

import enNavigation from '@/cms-core/translations/en/navigation.json';
import esNavigation from '@/cms-core/translations/es/navigation.json';
import frNavigation from '@/cms-core/translations/fr/navigation.json';

// Translation mapping
const translations = {
  pages: {
    en: enPages,
    es: esPages,
    fr: frPages,
  },
  about: {
    en: enAbout,
    es: esAbout,
    fr: frAbout,
  },
  contact: {
    en: enContact,
    es: esContact,
    fr: frContact,
  },
  dashboard: {
    en: enDashboard,
    es: esDashboard,
    fr: frDashboard,
  },
  navigation: {
    en: enNavigation,
    es: esNavigation,
    fr: frNavigation,
  },
};

export async function loadTranslation(locale, namespace = 'pages') {
  console.log(
    `Loading translations for locale: ${locale}, namespace: ${namespace}`
  );

  // Get the requested translations
  const messages = translations[namespace]?.[locale] || {};

  // Get fallback translations if needed
  const fallback =
    locale !== defaultLocale
      ? translations[namespace]?.[defaultLocale] || {}
      : {};

  // Merge fallback with messages (messages override fallback)
  const result = {
    ...fallback,
    ...messages,
  };

  console.log('Final merged translations:', result);
  return result;
}
