import { loadTranslation } from './loadTranslation';

/**
 * Normalize a tag name to a slug for lookup
 * @param {string} tagName - The tag name from the post
 * @returns {string} The normalized slug
 */
function normalizeTagName(tagName) {
  return tagName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

/**
 * Get tag information for a specific locale
 * @param {string} tagSlug - The tag slug (e.g., "nextjs") or tag name (e.g., "Next.js")
 * @param {string} locale - The locale (e.g., "en", "es", "fr")
 * @returns {Object|null} Tag information or null if not found
 */
export async function getTagInfo(tagSlug, locale) {
  try {
    const t = await loadTranslation(locale, 'tags');

    // First try the exact slug
    let tag = t.tags?.[tagSlug];

    // If not found, try normalizing the tag name
    if (!tag) {
      const normalizedSlug = normalizeTagName(tagSlug);
      tag = t.tags?.[normalizedSlug];
    }

    // If still not found, try to find by name
    if (!tag && t.tags) {
      const tagEntry = Object.entries(t.tags).find(
        ([slug, tagData]) =>
          tagData.name === tagSlug ||
          tagData.name.toLowerCase() === tagSlug.toLowerCase()
      );
      if (tagEntry) {
        tag = tagEntry[1];
        tagSlug = tagEntry[0]; // Use the actual slug
      }
    }

    if (!tag) {
      // Fallback to English if tag not found in current locale
      if (locale !== 'en') {
        const fallbackT = await loadTranslation('en', 'tags');

        // Try exact slug
        let fallbackTag = fallbackT.tags?.[tagSlug];

        // Try normalized slug
        if (!fallbackTag) {
          const normalizedSlug = normalizeTagName(tagSlug);
          fallbackTag = fallbackT.tags?.[normalizedSlug];
        }

        // Try by name
        if (!fallbackTag && fallbackT.tags) {
          const tagEntry = Object.entries(fallbackT.tags).find(
            ([slug, tagData]) =>
              tagData.name === tagSlug ||
              tagData.name.toLowerCase() === tagSlug.toLowerCase()
          );
          if (tagEntry) {
            fallbackTag = tagEntry[1];
            tagSlug = tagEntry[0];
          }
        }

        if (fallbackTag) {
          return {
            ...fallbackTag,
            slug: tagSlug,
            fallback: true,
          };
        }
      }
      return null;
    }

    return {
      ...tag,
      slug: tagSlug,
    };
  } catch (error) {
    console.error('Error loading tag info:', error);
    return null;
  }
}

/**
 * Get all tags for a specific locale
 * @param {string} locale - The locale (e.g., "en", "es", "fr")
 * @returns {Array} Array of tag objects
 */
export async function getAllTags(locale) {
  try {
    const t = await loadTranslation(locale, 'tags');
    const tags = t.tags || {};

    return Object.keys(tags).map((slug) => ({
      slug,
      ...tags[slug],
    }));
  } catch (error) {
    console.error('Error loading tags:', error);
    return [];
  }
}

/**
 * Generate tag URL for a specific locale
 * @param {string} tagSlug - The tag slug (e.g., "nextjs") or tag name (e.g., "Next.js")
 * @param {string} locale - The locale (e.g., "en", "es", "fr")
 * @returns {string} The tag URL
 */
export async function getTagUrl(tagSlug, locale) {
  try {
    const tagInfo = await getTagInfo(tagSlug, locale);
    if (!tagInfo) {
      // Fallback to English path if tag not found
      return `/${locale}/blog/tag/${tagSlug}`;
    }

    // Map translated paths to actual route directories
    const pathMap = {
      en: 'tag',
      es: 'etiqueta',
      fr: 'etiquette',
    };

    const path = pathMap[locale] || 'tag';
    return `/${locale}/blog/${path}/${tagInfo.slug}`;
  } catch (error) {
    console.error('Error generating tag URL:', error);
    return `/${locale}/blog/tag/${tagSlug}`;
  }
}

/**
 * Find tag by translated name
 * @param {string} translatedName - The translated tag name
 * @param {string} locale - The locale (e.g., "en", "es", "fr")
 * @returns {Object|null} Tag object or null if not found
 */
export async function findTagByName(translatedName, locale) {
  try {
    const tags = await getAllTags(locale);
    return tags.find((tag) => tag.name === translatedName) || null;
  } catch (error) {
    console.error('Error finding tag by name:', error);
    return null;
  }
}
