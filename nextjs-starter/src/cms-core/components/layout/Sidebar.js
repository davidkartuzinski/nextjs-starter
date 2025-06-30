'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/cms-core/components/ui/card';
import { Badge } from '@/cms-core/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AboutWidget from '@/user-content/components/sidebar/optional/about-widget';
import SearchWidget from '@/user-content/components/sidebar/optional/search-widget';
import CategoryWidget from '@/user-content/components/sidebar/optional/category-widget';
import RecentPostsWidget from '@/user-content/components/sidebar/optional/recent-posts-widget';
import RecentPostsList from '@/user-content/components/sidebar/optional/recent-posts-list';

export default function Sidebar({
  recentPosts = [],
  categories = [],
  locale = 'en',
}) {
  const router = useRouter();
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      try {
        // Import the translation file dynamically
        const module = await import(
          `@/user-content/translations/${locale}/sidebar.json`
        );
        setTranslations(module.default);
      } catch (error) {
        console.warn(
          `Failed to load sidebar translations for ${locale}:`,
          error
        );
        // Fallback to English
        try {
          const fallbackModule = await import(
            '@/user-content/translations/en/sidebar.json'
          );
          setTranslations(fallbackModule.default);
        } catch (fallbackError) {
          console.error(
            'Failed to load fallback sidebar translations:',
            fallbackError
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadTranslations();
  }, [locale]);

  if (loading) {
    return (
      <aside className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Loading sidebar...
            </p>
          </CardContent>
        </Card>
      </aside>
    );
  }

  return (
    <aside className='space-y-6'>
      <SearchWidget locale={locale} />

      <AboutWidget locale={locale} />

      <RecentPostsWidget
        posts={recentPosts}
        locale={locale}
        maxPosts={2}
      />

      <CategoryWidget categories={categories} locale={locale} />
    </aside>
  );
}
