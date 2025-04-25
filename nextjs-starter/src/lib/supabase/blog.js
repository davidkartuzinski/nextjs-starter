import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Get all categories from Supabase
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data;
}

// Get posts by category from Supabase
export async function getPostsByCategory(categorySlug) {
  const { data, error } = await supabase
    .from('categories')
    .select(
      `
      id,
      posts:post_categories(
        post:posts(
          id,
          title,
          slug,
          summary,
          published_at
        )
      )
    `
    )
    .eq('slug', categorySlug)
    .single();

  if (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }

  // Transform the data to a more usable format
  const posts =
    data?.posts
      .map((item) => item.post)
      .filter(Boolean)
      .sort(
        (a, b) => new Date(b.published_at) - new Date(a.published_at)
      ) || [];

  return posts;
}

// Search posts in Supabase
export async function searchPosts(query) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }

  return data;
}

// Sync MDX post with Supabase
export async function syncPostWithSupabase(
  slug,
  frontmatter,
  categories = []
) {
  // First, upsert the post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .upsert(
      {
        title: frontmatter.title,
        slug: slug,
        summary: frontmatter.summary,
        published_at:
          frontmatter.publishedAt || new Date().toISOString(),
      },
      {
        onConflict: 'slug',
        returning: true,
      }
    )
    .select()
    .single();

  if (postError) {
    console.error('Error upserting post:', postError);
    return null;
  }

  // If categories are provided, sync them
  if (categories.length > 0) {
    // Get category IDs
    const { data: categoryData, error: categoryError } =
      await supabase
        .from('categories')
        .select('id, slug')
        .in('slug', categories);

    if (categoryError) {
      console.error('Error fetching categories:', categoryError);
    } else {
      // Delete existing category associations
      await supabase
        .from('post_categories')
        .delete()
        .eq('post_id', post.id);

      // Create new category associations
      const categoryAssociations = categoryData.map((category) => ({
        post_id: post.id,
        category_id: category.id,
      }));

      if (categoryAssociations.length > 0) {
        const { error: associationError } = await supabase
          .from('post_categories')
          .insert(categoryAssociations);

        if (associationError) {
          console.error(
            'Error creating category associations:',
            associationError
          );
        }
      }
    }
  }

  return post;
}

// Get all blog posts from filesystem and sync with Supabase
export async function getAllPosts() {
  const postsDir = path.join(process.cwd(), 'posts');
  const entries = fs.readdirSync(postsDir, {
    withFileTypes: true,
  });

  const posts = entries
    .filter((entry) => entry.isDirectory())
    .map((dir) => {
      const slug = dir.name;

      const postsDir = path.join(process.cwd(), 'posts', slug);
      const fullPath = path.join(postsDir, 'page.mdx');

      // ⛔ prevent crashes from invalid slugs like image filenames
      if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️ Skipping: No MDX found for slug '${slug}'`);
        return null;
      }

      const mdxPath = path.join(postsDir, 'page.mdx');

      // Skip if page.mdx doesn't exist
      if (!fs.existsSync(mdxPath)) return null;

      // Read markdown file as string
      const fileContents = fs.readFileSync(mdxPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const { data } = matter(fileContents);

      // Sync with Supabase
      syncPostWithSupabase(slug, data, data.categories || []);

      // Combine the data with the slug
      return {
        slug,
        ...data,
      };
    })
    .filter(Boolean); // Remove null entries

  // Sort posts by date
  return posts.sort((a, b) => {
    if (a.publishedAt < b.publishedAt) {
      return 1;
    } else {
      return -1;
    }
  });
}
