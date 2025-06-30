// src/lib/supabase/blog.server.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClientComponentClient } from '@/cms-core/lib/supabase/client';

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
export async function getAllPosts() {
  const postsDir = path.join(process.cwd(), 'posts');
  const entries = fs.readdirSync(postsDir, { withFileTypes: true });

  const posts = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (dir) => {
        const slug = dir.name;
        // Look for the English version first, then fallback to other locales
        const postPath = path.join(postsDir, slug, 'en', 'page.mdx');
        if (!fs.existsSync(postPath)) {
          // Try other locales if English doesn't exist
          const locales = ['es', 'fr'];
          for (const locale of locales) {
            const altPath = path.join(
              postsDir,
              slug,
              locale,
              'page.mdx'
            );
            if (fs.existsSync(altPath)) {
              const file = fs.readFileSync(altPath, 'utf8');
              const { data } = matter(file);

              await syncPostWithSupabase(
                slug,
                data,
                data.categories || [],
                data.tags || []
              );
              return { slug, ...data };
            }
          }
          return null;
        }

        const file = fs.readFileSync(postPath, 'utf8');
        const { data } = matter(file);

        await syncPostWithSupabase(
          slug,
          data,
          data.categories || [],
          data.tags || []
        );
        return { slug, ...data };
      })
  );

  return posts
    .filter(Boolean)
    .sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at)
    );
}

// --- Search MDX posts ---
export async function searchPosts(query) {
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
        // Look for the English version first, then fallback to other locales
        const postPath = path.join(postsDir, slug, 'en', 'page.mdx');
        let file, data, content;

        if (!fs.existsSync(postPath)) {
          // Try other locales if English doesn't exist
          const locales = ['es', 'fr'];
          for (const locale of locales) {
            const altPath = path.join(
              postsDir,
              slug,
              locale,
              'page.mdx'
            );
            if (fs.existsSync(altPath)) {
              file = fs.readFileSync(altPath, 'utf8');
              const parsed = matter(file);
              data = parsed.data;
              content = parsed.content;
              break;
            }
          }
          if (!file) return null;
        } else {
          file = fs.readFileSync(postPath, 'utf8');
          const parsed = matter(file);
          data = parsed.data;
          content = parsed.content;
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
export async function getCategories() {
  const posts = await getAllPosts();
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

// --- Get posts by category ---
export async function getPostsByCategory(categorySlug) {
  const posts = await getAllPosts();

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
export async function getPostsByTag(tagSlug) {
  const posts = await getAllPosts();

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

// --- Get tags from MDX posts ---
export async function getTags() {
  const posts = await getAllPosts();
  const tagSet = new Set();

  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => tagSet.add(tag));
    }
  });

  return Array.from(tagSet).map((tag) => ({
    id: tag,
    name: tag
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    slug: tag,
  }));
}

// --- Get featured posts ---
export async function getFeaturedPosts(limit = 3) {
  const posts = await getAllPosts();

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
export async function getRecentPosts(limit = 3) {
  const posts = await getAllPosts();

  return posts.slice(0, limit).map((post) => ({
    ...post,
    published_at: post.published_at || post.publishedAt,
    categories: post.categories || [],
    tags: post.tags || [],
  }));
}
