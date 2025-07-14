import { localizedSlugs } from '@/user-content/routes/slugs';

export function resolveTranslationKey(locale, slug) {
  return Object.keys(localizedSlugs).find(
    (key) => localizedSlugs[key][locale] === slug
  );
}
