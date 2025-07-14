'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AboutWidget from '@/user-content/components/sidebar/optional/about-widget';
import SearchWidget from '@/user-content/components/sidebar/optional/search-widget';
import CategoryWidget from '@/user-content/components/sidebar/optional/category-widget';
import TagWidget from '@/user-content/components/sidebar/optional/tag-widget';
import RecentPostsWidget from '@/user-content/components/sidebar/optional/recent-posts-widget';
import RecentPostsList from '@/user-content/components/sidebar/optional/recent-posts-list';

export default function Sidebar({
  recentPosts = [],
  categories = [],
  tags = [],
  locale = 'en',
  minPostCount = 1,
}) {
  const router = useRouter();
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      try {
        // Import the translation file dynamically
        const sidebarTranslations = await import(
          `@/user-content/translations/${locale}/sidebar.json`
        );
        setTranslations(sidebarTranslations.default);
      } catch (error) {
        console.warn(
          `Failed to load sidebar translations for ${locale}:`,
          error
        );
        // Fallback to English
        try {
          const fallbackTranslations = await import(
            '@/user-content/translations/en/sidebar.json'
          );
          setTranslations(fallbackTranslations.default);
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

      <TagWidget
        tags={tags}
        locale={locale}
        minPostCount={minPostCount}
      />
    </aside>
  );
}
