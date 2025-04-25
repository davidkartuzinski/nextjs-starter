import Link from 'next/link';
import { Suspense } from 'react';
import { searchPosts, getCategories } from '@/lib/supabase/blog';
import Sidebar from '@/components/layout/Sidebar';
import BlogPostCard from '@/components/blog/BlogPostCard';
import Pagination from '@/components/blog/Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Number of posts per page
const POSTS_PER_PAGE = 6;

export function generateMetadata({ searchParams }) {
  const query = searchParams?.q || '';

  return {
    title: `Search: ${query} | Your Blog Name`,
    description: `Search results for "${query}"`,
  };
}

export default async function SearchPage({ searchParams }) {
  const query = searchParams?.q || '';
  const page = parseInt(searchParams?.page || '1');

  const posts = await searchPosts(query);
  const categories = await getCategories();

  // Calculate pagination
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPagePosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  return (
    <div className='container py-8'>
      <div className='flex flex-col gap-4 md:gap-8'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Search Results
          </h1>
          <p className='text-muted-foreground'>
            {posts.length} {posts.length === 1 ? 'result' : 'results'}{' '}
            for "{query}"
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4'>
          <div className='col-span-1 md:col-span-2 lg:col-span-3'>
            {currentPagePosts.length > 0 ? (
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {currentPagePosts.map((post) => (
                  <Suspense
                    key={post.slug}
                    fallback={<PostSkeleton />}
                  >
                    <BlogPostCard
                      post={{
                        ...post,
                        publishedAt: post.published_at,
                      }}
                    />
                  </Suspense>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                  <p className='text-center text-muted-foreground'>
                    No results found for "{query}".
                  </p>
                </CardContent>
              </Card>
            )}

            {totalPages > 1 && (
              <div className='mt-8'>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath={`/blog/search?q=${encodeURIComponent(
                    query
                  )}`}
                  isQueryParam
                />
              </div>
            )}
          </div>

          <div className='col-span-1'>
            <Sidebar
              recentPosts={posts.slice(0, 5).map((post) => ({
                slug: post.slug,
                title: post.title,
                date: new Date(post.published_at).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                ),
              }))}
              categories={categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PostSkeleton() {
  return (
    <Card>
      <div className='p-6 space-y-2'>
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-4 w-1/4' />
        <div className='space-y-2 mt-4'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-2/3' />
        </div>
        <div className='mt-4'>
          <Skeleton className='h-8 w-24' />
        </div>
      </div>
    </Card>
  );
}
