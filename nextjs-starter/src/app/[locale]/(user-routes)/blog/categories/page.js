import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getCategories } from '@/cms-core/lib/supabase/blog.server';
import { getCategoryUrl } from '@/cms-core/lib/i18n/category-utils';
import { loadTranslation } from '@/cms-core/lib/i18n/loadTranslation';
import { locales } from '@/cms-core/lib/i18n/config';
import Sidebar from '@/cms-core/components/layout/Sidebar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/cms-core/components/ui/card';
import { Badge } from '@/cms-core/components/ui/badge';
import { Skeleton } from '@/cms-core/components/ui/skeleton';

// --- Metadata ---
export async function generateMetadata({ params }) {
  const { locale } = await Promise.resolve(params);

  if (!locales.includes(locale)) {
    return {
      title: 'Categories Not Found',
    };
  }

  return {
    title: 'Categories | Your Blog Name',
    description: 'Browse all blog categories',
  };
}

// --- Page Component ---
export default async function CategoriesPage({ params }) {
  const { locale } = await Promise.resolve(params);

  if (!locales.includes(locale)) notFound();

  // Load translations
  const t = await loadTranslation(locale, 'categories');

  const categories = await getCategories(locale);

  // Generate category URLs
  const categoriesWithUrls = await Promise.all(
    categories.map(async (category) => {
      const url = await getCategoryUrl(category.slug, locale);
      return {
        ...category,
        url,
      };
    })
  );

  return (
    <div className='container py-8'>
      <div className='flex flex-col gap-4 md:gap-8'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            {t.categories?.pageTitle || 'Categories'}
          </h1>
          <p className='text-muted-foreground'>
            {t.categories?.pageDescription ||
              'Browse all blog categories to find topics that interest you.'}
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4'>
          <div className='col-span-1 md:col-span-2 lg:col-span-3'>
            {categoriesWithUrls.length > 0 ? (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {categoriesWithUrls.map((category) => (
                  <Suspense
                    key={category.slug}
                    fallback={<CategorySkeleton />}
                  >
                    <Card className='hover:shadow-md transition-shadow'>
                      <CardHeader>
                        <CardTitle className='text-lg'>
                          <Link
                            href={category.url}
                            className='hover:underline'
                          >
                            {category.name}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className='text-sm text-muted-foreground mb-3'>
                          {category.description}
                        </p>
                        <Badge variant='outline' asChild>
                          <Link href={category.url}>
                            {t.categories?.viewPosts || 'View Posts'}
                          </Link>
                        </Badge>
                      </CardContent>
                    </Card>
                  </Suspense>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                  <p className='text-center text-muted-foreground'>
                    {t.categories?.noCategories ||
                      'No categories found.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className='col-span-1'>
            <Sidebar
              recentPosts={[]}
              categories={categories}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Skeleton Components ---
function CategorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-3/4' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-4 w-full mb-3' />
        <Skeleton className='h-8 w-24' />
      </CardContent>
    </Card>
  );
}
