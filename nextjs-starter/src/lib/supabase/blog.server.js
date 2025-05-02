// src/lib/supabase/blog.server.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClientComponentClient } from '@/lib/supabase/client';

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
        const postPath = path.join(postsDir, slug, 'page.mdx');
        if (!fs.existsSync(postPath)) return null;

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
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );
}
