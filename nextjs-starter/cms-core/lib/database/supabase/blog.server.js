// src/lib/supabase/blog.server.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClientComponentClient } from './client';

const supabase = createClientComponentClient();

export async function syncPostWithSupabase(
  slug,
  frontmatter,
  categories = [],
  tags = []
) {
  const { data: post, error: postError } = await supabase
    .from('posts')
    .upsert(
      {
        title: frontmatter.title,
        slug,
        summary: frontmatter.summary,
        published_at:
          frontmatter.published_at ||
          frontmatter.publishedAt ||
          new Date().toISOString(),
        featured: frontmatter.featured || false,
      },
      { onConflict: 'slug', returning: 'representation' }
    )
    .select()
    .single();

  if (postError || !post) {
    console.error('Error upserting post:', postError);
    return null;
  }

  // Categories
  const { data: existingCategories = [] } = await supabase
    .from('categories')
    .select('id, slug')
    .in('slug', categories);

  const existingSlugs = existingCategories.map((c) => c.slug);
  const missingCategories = categories.filter(
    (slug) => !existingSlugs.includes(slug)
  );

  if (missingCategories.length > 0) {
    await supabase.from('categories').insert(
      missingCategories.map((slug) => ({
        name: slug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        slug,
      }))
    );
  }

  const { data: finalCategories = [] } = await supabase
    .from('categories')
    .select('id, slug')
    .in('slug', categories);

  await supabase
    .from('post_categories')
    .delete()
    .eq('post_id', post.id);

  await supabase.from('post_categories').upsert(
    finalCategories.map((cat) => ({
      post_id: post.id,
      category_id: cat.id,
    }))
  );

  // Tags
  const { data: existingTags = [] } = await supabase
    .from('tags')
    .select('id, slug')
    .in('slug', tags);

  const existingTagSlugs = existingTags.map((t) => t.slug);
  const missingTags = tags.filter(
    (slug) => !existingTagSlugs.includes(slug)
  );

  if (missingTags.length > 0) {
    await supabase.from('tags').insert(
      missingTags.map((slug) => ({
        name: slug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        slug,
      }))
    );
  }

  const { data: finalTags = [] } = await supabase
    .from('tags')
    .select('id, slug')
    .in('slug', tags);

  await supabase.from('post_tags').delete().eq('post_id', post.id);

  await supabase.from('post_tags').upsert(
    finalTags.map((tag) => ({
      post_id: post.id,
      tag_id: tag.id,
    }))
  );

  return post;
}

// --- Load all MDX posts ---
export async function getAllPosts(locale = 'en') {
  const postsDir = path.join(process.cwd(), 'posts');
  const entries = fs.readdirSync(postsDir, { withFileTypes: true });

  const posts = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (dir) => {
        const slug = dir.name;

        // First, try to get the post in the requested locale
        const localePostPath = path.join(
          postsDir,
          slug,
          locale,
          'page.mdx'
        );
        let postData = null;
        let postLocale = locale;

        if (fs.existsSync(localePostPath)) {
          // Post exists in requested locale
          const file = fs.readFileSync(localePostPath, 'utf8');
          const { data } = matter(file);
          postData = { slug, ...data, locale: locale };
          postLocale = locale;
        } else {
          // Post doesn't exist in requested locale, fall back to English
          const englishPostPath = path.join(
            postsDir,
            slug,
            'en',
            'page.mdx'
          );
          if (fs.existsSync(englishPostPath)) {
            const file = fs.readFileSync(englishPostPath, 'utf8');
            const { data } = matter(file);
            postData = {
              slug,
              ...data,
              locale: 'en',
              fallback: true,
            };
            postLocale = 'en';
          } else {
            // Try other locales if English doesn't exist
            const otherLocales = ['es', 'fr'].filter(
              (l) => l !== locale
            );
            for (const altLocale of otherLocales) {
              const altPath = path.join(
                postsDir,
                slug,
                altLocale,
                'page.mdx'
              );
              if (fs.existsSync(altPath)) {
                const file = fs.readFileSync(altPath, 'utf8');
                const { data } = matter(file);
                postData = {
                  slug,
                  ...data,
                  locale: altLocale,
                  fallback: true,
                };
                postLocale = altLocale;
                break;
              }
            }
          }
        }

        if (!postData) {
          return null;
        }

        // Sync with Supabase using the found post data
        await syncPostWithSupabase(
          slug,
          postData,
          postData.categories || [],
          postData.tags || []
        );

        return {
          ...postData,
          published_at: postData.published_at || postData.publishedAt,
          categories: postData.categories || [],
          tags: postData.tags || [],
        };
      })
  );

  return posts
    .filter(Boolean)
    .sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at)
    );
}

// --- Search MDX posts ---
export async function searchPosts(query, locale = 'en') {
  if (!query || query.trim() === '') {
    return [];
  }

  const postsDir = path.join(process.cwd(), 'posts');
  const entries = fs.readdirSync(postsDir, { withFileTypes: true });
  const searchTerm = query.toLowerCase().trim();

  const posts = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (dir) => {
        const slug = dir.name;

        // First, try to get the post in the requested locale
        const localePostPath = path.join(
          postsDir,
          slug,
          locale,
          'page.mdx'
        );
        let postData = null;
        let postLocale = locale;
        let file, data, content;

        if (fs.existsSync(localePostPath)) {
          // Post exists in requested locale
          file = fs.readFileSync(localePostPath, 'utf8');
          const parsed = matter(file);
          data = parsed.data;
          content = parsed.content;
          postData = { slug, ...data, locale: locale };
          postLocale = locale;
        } else {
          // Post doesn't exist in requested locale, fall back to English
          const englishPostPath = path.join(
            postsDir,
            slug,
            'en',
            'page.mdx'
          );
          if (fs.existsSync(englishPostPath)) {
            file = fs.readFileSync(englishPostPath, 'utf8');
            const parsed = matter(file);
            data = parsed.data;
            content = parsed.content;
            postData = {
              slug,
              ...data,
              locale: 'en',
              fallback: true,
            };
            postLocale = 'en';
          } else {
            // Try other locales if English doesn't exist
            const otherLocales = ['es', 'fr'].filter(
              (l) => l !== locale
            );
            for (const altLocale of otherLocales) {
              const altPath = path.join(
                postsDir,
                slug,
                altLocale,
                'page.mdx'
              );
              if (fs.existsSync(altPath)) {
                file = fs.readFileSync(altPath, 'utf8');
                const parsed = matter(file);
                data = parsed.data;
                content = parsed.content;
                postData = {
                  slug,
                  ...data,
                  locale: altLocale,
                  fallback: true,
                };
                postLocale = altLocale;
                break;
              }
            }
          }
        }

        if (!postData) {
          return null;
        }

        // Search in title, summary, content, categories, and tags
        const searchableText = [
          data.title || '',
          data.summary || '',
          content,
          (data.categories || []).join(' '),
          (data.tags || []).join(' '),
        ]
          .join(' ')
          .toLowerCase();

        if (searchableText.includes(searchTerm)) {
          return {
            slug,
            ...data,
            published_at: data.published_at || data.publishedAt,
            categories: data.categories || [],
            tags: data.tags || [],
            locale: postLocale,
            fallback: postLocale !== locale,
          };
        }

        return null;
      })
  );

  return posts
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(b.published_at || b.publishedAt) -
        new Date(a.published_at || a.publishedAt)
    );
}

// --- Get categories from MDX posts ---
export async function getCategories(locale = 'en') {
  try {
    // Import the category utility functions
    const { getAllCategories } = await import(
      '../../i18n/category-utils'
    );

    // Get categories from translation files
    const translatedCategories = await getAllCategories(locale);

    // Also get posts to ensure we only show categories that have posts
    const posts = await getAllPosts(locale);
    const categorySet = new Set();

    posts.forEach((post) => {
      if (post.categories) {
        post.categories.forEach((category) =>
          categorySet.add(category)
        );
      }
    });

    // Filter translated categories to only include those that have posts
    const availableCategories = translatedCategories.filter(
      (category) => categorySet.has(category.slug)
    );

    return availableCategories.map((category) => ({
      id: category.slug,
      name: category.name,
      slug: category.slug,
      description: category.description,
      path: category.path,
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    // Fallback to original method
    const posts = await getAllPosts(locale);
    const categorySet = new Set();

    posts.forEach((post) => {
      if (post.categories) {
        post.categories.forEach((category) =>
          categorySet.add(category)
        );
      }
    });

    return Array.from(categorySet).map((category) => ({
      id: category,
      name: category
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      slug: category,
    }));
  }
}

// --- Get posts by category ---
export async function getPostsByCategory(
  categorySlug,
  locale = 'en'
) {
  const posts = await getAllPosts(locale);

  return posts
    .filter(
      (post) =>
        post.categories &&
        post.categories.some(
          (category) =>
            category.toLowerCase() === categorySlug.toLowerCase()
        )
    )
    .map((post) => ({
      ...post,
      published_at: post.published_at || post.publishedAt,
      categories: post.categories || [],
      tags: post.tags || [],
    }));
}

// --- Get posts by tag ---
export async function getPostsByTag(tagSlug, locale = 'en') {
  try {
    const posts = await getAllPosts(locale);

    // Import tag utilities to get tag info
    const { getTagInfo } = await import('../../i18n/tag-utils');

    // Get tag info to find the tag name
    const tagInfo = await getTagInfo(tagSlug, locale);
    const tagName = tagInfo?.name || tagSlug;

    return posts
      .filter(
        (post) =>
          post.tags &&
          post.tags.some(
            (tag) =>
              tag.toLowerCase() === tagName.toLowerCase() ||
              tag.toLowerCase() === tagSlug.toLowerCase()
          )
      )
      .map((post) => ({
        ...post,
        published_at: post.published_at || post.publishedAt,
        categories: post.categories || [],
        tags: post.tags || [],
      }));
  } catch (error) {
    console.error('Error getting posts by tag:', error);
    // Fallback to original method
    const posts = await getAllPosts(locale);

    return posts
      .filter(
        (post) =>
          post.tags &&
          post.tags.some(
            (tag) => tag.toLowerCase() === tagSlug.toLowerCase()
          )
      )
      .map((post) => ({
        ...post,
        published_at: post.published_at || post.publishedAt,
        categories: post.categories || [],
        tags: post.tags || [],
      }));
  }
}

// --- Get tags from MDX posts ---
export async function getTags(locale = 'en') {
  try {
    // Import the tag utility functions
    const { getAllTags, getTagInfo } = await import(
      '../../i18n/tag-utils'
    );

    // Get tags from translation files - return ALL tags, not just those with posts
    const translatedTags = await getAllTags(locale);

    // Get posts to calculate post counts for each tag
    const posts = await getAllPosts(locale);
    const tagCounts = {};

    posts.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tagName) => {
          // Try to find the corresponding slug for this tag name
          const matchingTag = translatedTags.find(
            (tag) =>
              tag.name === tagName ||
              tag.name.toLowerCase() === tagName.toLowerCase() ||
              tag.slug ===
                tagName
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
          );

          if (matchingTag) {
            tagCounts[matchingTag.slug] =
              (tagCounts[matchingTag.slug] || 0) + 1;
          } else {
            // If no matching tag found, use the tag name as is
            const fallbackSlug = tagName
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-');
            tagCounts[fallbackSlug] =
              (tagCounts[fallbackSlug] || 0) + 1;
          }
        });
      }
    });

    return translatedTags.map((tag) => ({
      id: tag.slug,
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      path: tag.path,
      postCount: tagCounts[tag.slug] || 0,
    }));
  } catch (error) {
    console.error('Error getting tags:', error);
    // Fallback to original method
    const posts = await getAllPosts(locale);
    const tagSet = new Set();
    const tagCounts = {};

    posts.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag) => {
          tagSet.add(tag);
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    return Array.from(tagSet).map((tag) => ({
      id: tag,
      name: tag
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      slug: tag,
      postCount: tagCounts[tag] || 0,
    }));
  }
}

// --- Get featured posts ---
export async function getFeaturedPosts(limit = 3, locale = 'en') {
  const posts = await getAllPosts(locale);

  return posts
    .filter((post) => post.featured)
    .slice(0, limit)
    .map((post) => ({
      ...post,
      published_at: post.published_at || post.publishedAt,
      categories: post.categories || [],
      tags: post.tags || [],
    }));
}

// --- Get recent posts ---
export async function getRecentPosts(limit = 3, locale = 'en') {
  const posts = await getAllPosts(locale);

  return posts.slice(0, limit).map((post) => ({
    ...post,
    published_at: post.published_at || post.publishedAt,
    categories: post.categories || [],
    tags: post.tags || [],
  }));
}
