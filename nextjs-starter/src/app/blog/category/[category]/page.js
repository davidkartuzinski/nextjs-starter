import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import {
  getPostsByCategory,
  getCategories,
} from '@/lib/supabase/blog';
import Sidebar from '@/components/layout/Sidebar';
import BlogPostCard from '@/components/blog/BlogPostCard';
import Pagination from '@/components/blog/Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Number of posts per page
const POSTS_PER_PAGE = 6;

export async function generateMetadata({ params }) {
  const categorySlug = params.category;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} | Your Blog Name`,
    description: `Articles in the ${category.name} category`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const categorySlug = params.category;
  const page = parseInt(searchParams?.page || '1');

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(categorySlug);

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
            Category: {category.name}
          </h1>
          <p className='text-muted-foreground'>
            Browse articles in the {category.name} category.
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
                        categories: [category.name],
                      }}
                    />
                  </Suspense>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                  <p className='text-center text-muted-foreground'>
                    No posts found in this category.
                  </p>
                </CardContent>
              </Card>
            )}

            {totalPages > 1 && (
              <div className='mt-8'>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath={`/blog/category/${categorySlug}`}
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
