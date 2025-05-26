import { defaultLocale } from './config';

export async function loadTranslation(locale, namespace = 'pages') {
  let messages = {};
  let fallback = {};

  try {
    messages = (
      await import(
        `@/cms-core/translations/${locale}/${namespace}.json`
      )
    ).default;
  } catch {
    console.warn(`⚠️ Missing translations for locale "${locale}"`);
  }

  if (locale !== defaultLocale) {
    try {
      fallback = (
        await import(
          `@/cms-core/translations/${defaultLocale}/${namespace}.json`
        )
      ).default;
    } catch {
      console.warn(
        `⚠️ Missing fallback translations for default locale "${defaultLocale}"`
      );
    }
  }

  return {
    ...fallback,
    ...messages,
  };
}
