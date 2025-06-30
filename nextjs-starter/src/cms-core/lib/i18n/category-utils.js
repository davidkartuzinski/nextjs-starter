import { loadTranslation } from './loadTranslation';

/**
 * Get category information for a specific locale
 * @param {string} categorySlug - The category slug (e.g., "getting-started")
 * @param {string} locale - The locale (e.g., "en", "es", "fr")
 * @returns {Object|null} Category information or null if not found
 */
export async function getCategoryInfo(categorySlug, locale) {
  try {
    const t = await loadTranslation(locale, 'categories');
    const category = t.categories?.[categorySlug];

    if (!category) {
      // Fallback to English if category not found in current locale
      if (locale !== 'en') {
        const fallbackT = await loadTranslation('en', 'categories');
        const fallbackCategory = fallbackT.categories?.[categorySlug];
        if (fallbackCategory) {
          return {
            ...fallbackCategory,
            slug: categorySlug,
            fallback: true,
          };
        }
      }
      return null;
    }

    return {
      ...category,
      slug: categorySlug,
    };
  } catch (error) {
    console.error('Error loading category info:', error);
    return null;
  }
}

/**
 * Get all categories for a specific locale
 * @param {string} locale - The locale (e.g., "en", "es", "fr")
 * @returns {Array} Array of category objects
 */
export async function getAllCategories(locale) {
  try {
    const t = await loadTranslation(locale, 'categories');
    const categories = t.categories || {};

    return Object.keys(categories).map((slug) => ({
      slug,
      ...categories[slug],
    }));
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

/**
 * Generate category URL for a specific locale
 * @param {string} categorySlug - The category slug (e.g., "getting-started")
 * @param {string} locale - The locale (e.g., "en", "es", "fr")
 * @returns {string} The category URL
 */
export async function getCategoryUrl(categorySlug, locale) {
  try {
    const categoryInfo = await getCategoryInfo(categorySlug, locale);
    if (!categoryInfo) {
      // Fallback to English path if category not found
      return `/${locale}/blog/category/${categorySlug}`;
    }

    // Map translated paths to actual route directories
    const pathMap = {
      en: 'category',
      es: 'categoria',
      fr: 'categorie',
    };

    const path = pathMap[locale] || 'category';
    return `/${locale}/blog/${path}/${categorySlug}`;
  } catch (error) {
    console.error('Error generating category URL:', error);
    return `/${locale}/blog/category/${categorySlug}`;
  }
}

/**
 * Find category by translated name
 * @param {string} translatedName - The translated category name
 * @param {string} locale - The locale (e.g., "en", "es", "fr")
 * @returns {Object|null} Category object or null if not found
 */
export async function findCategoryByName(translatedName, locale) {
  try {
    const categories = await getAllCategories(locale);
    return (
      categories.find((cat) => cat.name === translatedName) || null
    );
  } catch (error) {
    console.error('Error finding category by name:', error);
    return null;
  }
}
