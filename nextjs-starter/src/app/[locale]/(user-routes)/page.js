import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getAllPosts } from '@/cms-core/lib/supabase/blog.server';
import { loadTranslation } from '@/cms-core/lib/i18n/loadTranslation';
import { locales } from '@/cms-core/lib/i18n/config';
import HeroSection from '@/cms-core/components/home/HeroSection';
import FeatureGrid from '@/cms-core/components/home/FeatureGrid';
import SplitSection from '@/cms-core/components/home/SplitSection';
import BlogPosts from '@/cms-core/components/home/BlogPosts';

// --- Metadata ---
export async function generateMetadata({ params }) {
  const { locale } = await Promise.resolve(params);

  if (!locales.includes(locale)) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: 'Your Blog Name - Home',
    description: 'Welcome to your blog homepage',
  };
}

// --- Page Component ---
export default async function HomePage({ params }) {
  const { locale } = await Promise.resolve(params);

  if (!locales.includes(locale)) notFound();

  // Load translations
  const t = await loadTranslation(locale, 'pages');

  // Get recent posts for the blog section
  const posts = await getAllPosts(locale);
  const featuredCategory =
    posts.length > 0 ? posts[0].categories?.[0] : null;

  return (
    <div className='min-h-screen'>
      <Suspense fallback={<div>Loading hero...</div>}>
        <HeroSection locale={locale} />
      </Suspense>

      <Suspense fallback={<div>Loading features...</div>}>
        <FeatureGrid locale={locale} />
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
}
