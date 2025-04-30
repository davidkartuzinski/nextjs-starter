import { createClientComponentClient } from '@/lib/supabase/client';
const supabase = createClientComponentClient();
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// --- Categories ---
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

// --- Tags: Get all tags ---
export async function getTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  return data;
}

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
          post_categories(
            category:categories(id, name, slug)
          ),
          post_tags(
            tag:tags(id, name, slug)
          )
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

  const posts =
    data?.post_categories
      ?.map((item) => item.post)
      .filter(Boolean)
      .map((post) => ({
        ...post,
        categories:
          post.post_categories?.map((pc) => pc.category) || [],
        tags: post.post_tags?.map((pt) => pt.tag) || [],
      }))
      .sort(
        (a, b) => new Date(b.published_at) - new Date(a.published_at)
      ) || [];

  return posts;
}

// --- Tags ---
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
          post_tags(
            tag:tags(id, name, slug)
          ),
          post_categories(
            category:categories(id, name, slug)
          )
        )
      )
    `
    )
    .eq('slug', tagSlug)
    .single();

  if (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }

  const posts =
    data?.post_tags
      ?.map((item) => item.post)
      .filter(Boolean)
      .map((post) => ({
        ...post,
        tags: post.post_tags?.map((pt) => pt.tag) || [],
        categories:
          post.post_categories?.map((pc) => pc.category) || [],
      }))
      .sort(
        (a, b) => new Date(b.published_at) - new Date(a.published_at)
      ) || [];

  return posts;
}

// --- Search ---
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
      post_categories(
        category:categories(id, name, slug)
      ),
      post_tags(
        tag:tags(id, name, slug)
      )
    `
    )
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }

  return data.map((post) => ({
    ...post,
    categories:
      post.post_categories
        ?.map((pc) => pc.category)
        .filter(Boolean) || [],
    tags: post.post_tags?.map((pt) => pt.tag).filter(Boolean) || [],
  }));
}

// --- Sync MDX with Supabase ---
export async function syncPostWithSupabase(
  slug,
  frontmatter,
  categories = [],
  tags = []
) {
  const supabase = createClientComponentClient();

  // 1. Upsert the post (DO NOT insert tags/categories into posts table)
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

  // 2. Handle Categories
  if (categories.length > 0) {
    const { data: existingCategories = [] } = await supabase
      .from('categories')
      .select('id, slug')
      .in('slug', categories);

    const existingSlugs = existingCategories.map((c) => c.slug);
    const missingCategories = categories.filter(
      (slug) => !existingSlugs.includes(slug)
    );

    if (missingCategories.length > 0) {
      const insertData = missingCategories.map((slug) => ({
        name: slug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        slug,
      }));

      const { error: insertCategoryError } = await supabase
        .from('categories')
        .insert(insertData);

      if (
        insertCategoryError &&
        insertCategoryError.code !== '23505'
      ) {
        console.error(
          'Error inserting categories:',
          insertCategoryError
        );
      }
    }

    const { data: finalCategories = [] } = await supabase
      .from('categories')
      .select('id, slug')
      .in('slug', categories);

    await supabase
      .from('post_categories')
      .delete()
      .eq('post_id', post.id);

    const categoryAssociations = finalCategories.map((cat) => ({
      post_id: post.id,
      category_id: cat.id,
    }));

    if (categoryAssociations.length > 0) {
      const { error: categoryAssociationError } = await supabase
        .from('post_categories')
        .upsert(categoryAssociations, {
          onConflict: ['post_id', 'category_id'],
        });

      if (categoryAssociationError) {
        console.error(
          'Error creating category associations:',
          categoryAssociationError
        );
      }
    }
  }

  // 3. Handle Tags
  if (tags.length > 0) {
    const { data: existingTags = [] } = await supabase
      .from('tags')
      .select('id, slug')
      .in('slug', tags);

    const existingTagSlugs = existingTags.map((t) => t.slug);
    const missingTags = tags.filter(
      (slug) => !existingTagSlugs.includes(slug)
    );

    // --- Insert Missing Tags ---
    if (missingTags.length > 0) {
      const insertData = missingTags.map((slug) => ({
        name: slug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        slug,
      }));

      const { error: insertTagError } = await supabase
        .from('tags')
        .insert(insertData);

      if (insertTagError && insertTagError.code !== '23505') {
        console.error('Error inserting tags:', insertTagError);
      }
    }

    const { data: finalTags = [] } = await supabase
      .from('tags')
      .select('id, slug')
      .in('slug', tags);

    await supabase.from('post_tags').delete().eq('post_id', post.id);

    const tagAssociations = finalTags.map((tag) => ({
      post_id: post.id,
      tag_id: tag.id,
    }));

    if (tagAssociations.length > 0) {
      const { error: tagAssociationError } = await supabase
        .from('post_tags')
        .upsert(tagAssociations, {
          onConflict: ['post_id', 'tag_id'],
        });

      if (tagAssociationError) {
        console.error(
          'Error creating tag associations:',
          tagAssociationError
        );
      }
    }
  }

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
        const postsPath = path.join(postsDir, slug, 'page.mdx');

        if (!fs.existsSync(postsPath)) {
          console.warn(
            `⚠️ Skipping: No MDX found for slug '${slug}'`
          );
          return null;
        }

        const fileContents = fs.readFileSync(postsPath, 'utf8');
        const { data } = matter(fileContents);

        // ❗️ Important: await the sync!
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
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

// --- Featured Posts ---
export async function getFeaturedPosts(limit = 3) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }

  return data;
}

// --- Recent Posts ---
export async function getRecentPosts(limit = 3) {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, summary, published_at')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }

  return data;
}
