import { Suspense } from 'react';
import { getCategories, searchPosts } from '@/lib/supabase/blog';
import BlogPostCard from '@/components/blog/BlogPostCard';
import Pagination from '@/components/blog/Pagination';
import Sidebar from '@/components/layout/Sidebar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const POSTS_PER_PAGE = 6;

// --- Metadata ---
export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  const query = q || '';

  return {
    title: query ? `Search: ${query}` : 'Search',
    description: query
      ? `Search results for "${query}"`
      : 'Search blog content by keywords',
  };
}

// --- Page Component ---
export default async function SearchPage({ searchParams }) {
  const { q, page: pageParam } = await searchParams;
  const query = q || '';
  const page = parseInt(pageParam || '1', 10);

  const posts = await searchPosts(query);
  const categories = await getCategories();

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
            {query ? `Results for "${query}"` : 'Search'}
          </h1>
          <p className='text-muted-foreground'>
            {query
              ? 'Showing results that match your search.'
              : 'Enter a search term to explore blog content.'}
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
                    <BlogPostCard post={post} />
                  </Suspense>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                  <p className='text-center text-muted-foreground'>
                    No posts found matching that search.
                  </p>
                </CardContent>
              </Card>
            )}

            {totalPages > 1 && (
              <div className='mt-8'>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath='/blog/search'
                  searchParams={{ q: query }}
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
                  { year: 'numeric', month: 'long', day: 'numeric' }
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

// --- Loading Skeleton ---
function PostSkeleton() {
  return (
    <Card>
      <CardHeader className='space-y-2'>
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-4 w-1/4' />
      </CardHeader>
      <CardContent className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </CardContent>
      <CardFooter>
        <Skeleton className='h-8 w-24' />
      </CardFooter>
    </Card>
  );
}
