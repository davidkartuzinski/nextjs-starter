import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getAllPosts } from '../../../../cms-core/lib/database/supabase/blog.server';
import { loadTranslation } from '../../../../cms-core/lib/i18n/loadTranslation';
import { locales } from '../../../../cms-core/lib/i18n/config';
import HeroSection from '@/user-content/components/home/HeroSection';
import FeatureGrid from '@/user-content/components/home/FeatureGrid';
import SplitSection from '@/user-content/components/home/SplitSection';
import BlogPosts from '@/user-content/components/home/BlogPosts';

// --- Metadata ---
export async function generateMetadata({ params }) {
  try {
    const { locale } = await Promise.resolve(params);
    console.log('🔍 Generating metadata for locale:', locale);

    if (!locales.includes(locale)) {
      return {
        title: 'Page Not Found',
      };
    }

    return {
      title: 'Your Blog Name - Home',
      description: 'Welcome to your blog homepage',
    };
  } catch (error) {
    console.error('❌ Error in generateMetadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred',
    };
  }
}

// --- Page Component ---
export default async function HomePage({ params }) {
  try {
    console.log('🔍 Rendering HomePage for params:', params);

    const { locale } = await Promise.resolve(params);
    console.log('🔍 Locale resolved:', locale);

    if (!locales.includes(locale)) {
      console.log('❌ Locale not found:', locale);
      notFound();
    }

    // Load translations
    console.log('🔍 Loading translations for locale:', locale);
    const t = await loadTranslation(locale, 'pages');
    console.log('🔍 Translations loaded:', !!t);

    // Get recent posts for the blog section
    console.log('🔍 Getting posts for locale:', locale);
    const posts = await getAllPosts(locale);
    console.log('🔍 Posts loaded:', posts.length);

    const featuredCategory =
      posts.length > 0 ? posts[0].categories?.[0] : null;
    console.log('🔍 Featured category:', featuredCategory);

    return (
      <div className='min-h-screen'>
        <Suspense fallback={<div>Loading hero...</div>}>
          <HeroSection
            title='Welcome to Our Blog'
            description='Discover amazing content and insights'
            buttonText='Get Started'
            buttonLink={`/${locale}/blog`}
          />
        </Suspense>

        <Suspense fallback={<div>Loading features...</div>}>
          <FeatureGrid
            features={[
              {
                icon: 'BookOpen',
                title: 'Read Articles',
                description:
                  'Explore our latest blog posts and insights',
                link: `/${locale}/blog`,
                linkText: 'Browse Posts',
              },
              {
                icon: 'Search',
                title: 'Search Content',
                description: "Find exactly what you're looking for",
                link: `/${locale}/blog/search`,
                linkText: 'Search Now',
              },
              {
                icon: 'Tag',
                title: 'Browse Categories',
                description: 'Organized content by topics and themes',
                link: `/${locale}/blog/categories`,
                linkText: 'View Categories',
              },
            ]}
          />
        </Suspense>

        <Suspense fallback={<div>Loading split section...</div>}>
          <SplitSection locale={locale} />
        </Suspense>

        <Suspense fallback={<div>Loading blog posts...</div>}>
          <BlogPosts
            category={featuredCategory}
            limit={6}
            locale={locale}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('❌ Error rendering HomePage:', error);
    console.error('❌ Error stack:', error.stack);

    // Return a fallback UI instead of crashing
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>
            Something went wrong
          </h1>
          <p className='text-muted-foreground'>
            We&apos;re experiencing technical difficulties. Please try
            again later.
          </p>
          <pre className='mt-4 text-xs text-red-500 bg-red-50 p-2 rounded'>
            {error.message}
          </pre>
        </div>
      </div>
    );
  }
}
