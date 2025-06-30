import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import {
  getPostsByCategory,
  getCategories,
} from '@/cms-core/lib/supabase/blog.server';
import { getCategoryInfo } from '@/cms-core/lib/i18n/category-utils';
import { loadTranslation } from '@/cms-core/lib/i18n/loadTranslation';
import { locales } from '@/cms-core/lib/i18n/config';
import Sidebar from '@/cms-core/components/layout/Sidebar';
import BlogPostCard from '@/cms-core/components/blog/BlogPostCard';
import Pagination from '@/cms-core/components/blog/Pagination';
import { Card, CardContent } from '@/cms-core/components/ui/card';
import { Skeleton } from '@/cms-core/components/ui/skeleton';

const POSTS_PER_PAGE = 6;

// --- Metadata ---
export async function generateMetadata({ params }) {
  const { category, locale } = await Promise.resolve(params);

  if (!locales.includes(locale)) {
    return {
      title: 'Category Not Found',
    };
  }

  const categoryInfo = await getCategoryInfo(category, locale);
  const categories = await getCategories(locale);
  const found = categories.find((c) => c.slug === category);

  if (!found && !categoryInfo) {
    return {
      title: 'Category Not Found',
    };
  }

  const categoryName = categoryInfo?.name || found?.name || category;

  return {
    title: `${categoryName} | Your Blog Name`,
    description: `Articles in the ${categoryName} category`,
  };
}

// --- Page Component ---
export default async function CategoryPage({ params, searchParams }) {
  const { category, locale } = await Promise.resolve(params);

  if (!locales.includes(locale)) notFound();

  const { page: pageParam } = await searchParams;

  const page = parseInt(pageParam || '1', 10);

  // Load translations
  const t = await loadTranslation(locale, 'categories');

  const categories = await getCategories(locale);
  const categoryFound = categories.find((c) => c.slug === category);
  const categoryInfo = await getCategoryInfo(category, locale);

  if (!categoryFound && !categoryInfo) notFound();

  const posts = await getPostsByCategory(category, locale);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPagePosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  // Use translated category info if available, fallback to found category
  const displayCategory = categoryInfo || categoryFound;
  const categoryName = displayCategory?.name || category;
  const categoryDescription =
    displayCategory?.description ||
    `Browse articles in the ${categoryName} category.`;

  return (
    <div className='container py-8'>
      <div className='flex flex-col gap-4 md:gap-8'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            {t.categories?.categoryTitle?.replace(
              '{name}',
              categoryName
            ) || `Category: ${categoryName}`}
          </h1>
          <p className='text-muted-foreground'>
            {categoryDescription}
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4'>
          <div className='col-span-1 md:col-span-2 lg:col-span-3'>
            {currentPagePosts.length > 0 ? (
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {currentPagePosts.map((post) => (
                  <Suspense
                    key={post.id || post.slug}
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
                    {t.categories?.noPosts ||
                      'No posts found in this category.'}
                  </p>
                </CardContent>
              </Card>
            )}

            {totalPages > 1 && (
              <div className='mt-8'>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath={`/${locale}/blog/category/${category}`}
                />
              </div>
            )}
          </div>

          <div className='col-span-1'>
            <Sidebar
              recentPosts={posts.slice(0, 5).map((post) => ({
                slug: post.slug,
                title: post.title,
                date:
                  post.published_at || post.publishedAt
                    ? new Date(
                        post.published_at || post.publishedAt
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Unpublished',
              }))}
              categories={categories}
              locale={locale}
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
