// src/components/home/BlogPosts.js

import Link from 'next/link';
import BlogPostCard from '@/components/blog/BlogPostCard';
import {
  getFeaturedPosts,
  getRecentPosts,
  getPostsByTag,
  getPostsByCategory,
} from '@/lib/supabase/blog.client';

export default async function BlogPosts({
  title = 'Recent Posts',
  featured = false,
  tag = null,
  category = null,
  limit = 3,
}) {
  let posts = [];
  let totalCount = 0;

  if (featured) {
    posts = await getFeaturedPosts(limit);
    totalCount = posts.length;
  } else if (tag) {
    const allTagPosts = await getPostsByTag(tag);
    totalCount = allTagPosts.length;
    posts = allTagPosts.slice(0, limit);
  } else if (category) {
    const allCategoryPosts = await getPostsByCategory(category);
    totalCount = allCategoryPosts.length;
    posts = allCategoryPosts.slice(0, limit);
  } else {
    posts = await getRecentPosts(limit);
    totalCount = posts.length;
  }

  const visibleCount = posts.length;

  return (
    <section className='w-full'>
      <div className='container mx-auto px-4 flex flex-col items-center justify-center text-left space-y-6 py-20 max-w-6xl'>
        <div className='text-center space-y-1'>
          <h2 className='text-2xl font-bold'>{title}</h2>

          {(tag || category) && (
            <p className='text-sm text-muted-foreground'>
              {`${visibleCount} of ${totalCount} in `}
              <Link
                href={
                  tag
                    ? `/blog/tag/${tag}`
                    : `/blog/category/${category}`
                }
                className='underline hover:text-primary'
              >
                {tag || category}
              </Link>
            </p>
          )}
        </div>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
