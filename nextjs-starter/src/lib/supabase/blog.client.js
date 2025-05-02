// src/lib/supabase/blog.client.js
import { createClientComponentClient } from '@/lib/supabase/client';
const supabase = createClientComponentClient();

// --- Categories ---
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  if (error) return [];
  return data;
}

// --- Tags ---
export async function getTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');
  if (error) return [];
  return data;
}

// --- Get Posts by Category ---
export async function getPostsByCategory(categorySlug) {
  const { data, error } = await supabase
    .from('categories')
    .select(
      `
      id,
      name,
      slug,
      post_categories(
        post:posts(
          id,
          title,
          slug,
          summary,
          published_at,
          post_categories(category:categories(id, name, slug)),
          post_tags(tag:tags(id, name, slug))
        )
      )
    `
    )
    .eq('slug', categorySlug)
    .single();

  if (error) return [];

  return (
    data?.post_categories
      ?.map((item) => item.post)
      .filter(Boolean)
      .map((post) => ({
        ...post,
        categories:
          post.post_categories?.map((pc) => pc.category) || [],
        tags: post.post_tags?.map((pt) => pt.tag) || [],
      })) || []
  ).sort(
    (a, b) => new Date(b.published_at) - new Date(a.published_at)
  );
}

// --- Get Posts by Tag ---
export async function getPostsByTag(tagSlug) {
  const { data, error } = await supabase
    .from('tags')
    .select(
      `
      id,
      name,
      slug,
      post_tags(
        post:posts(
          id,
          title,
          slug,
          summary,
          published_at,
          post_tags(tag:tags(id, name, slug)),
          post_categories(category:categories(id, name, slug))
        )
      )
    `
    )
    .eq('slug', tagSlug)
    .single();

  if (error) return [];

  return (
    data?.post_tags
      ?.map((item) => item.post)
      .filter(Boolean)
      .map((post) => ({
        ...post,
        tags: post.post_tags?.map((pt) => pt.tag) || [],
        categories:
          post.post_categories?.map((pc) => pc.category) || [],
      })) || []
  ).sort(
    (a, b) => new Date(b.published_at) - new Date(a.published_at)
  );
}

// --- Search Posts ---
export async function searchPosts(query) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      summary,
      published_at,
      post_categories(category:categories(id, name, slug)),
      post_tags(tag:tags(id, name, slug))
    `
    )
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
    .order('published_at', { ascending: false });

  if (error) return [];

  return data.map((post) => ({
    ...post,
    categories: post.post_categories?.map((pc) => pc.category) || [],
    tags: post.post_tags?.map((pt) => pt.tag) || [],
  }));
}

// --- Featured Posts ---
export async function getFeaturedPosts(limit = 3) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data;
}

// --- Recent Posts ---
export async function getRecentPosts(limit = 3) {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, summary, published_at')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data;
}
