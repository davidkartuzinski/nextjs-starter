'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../../cms-core/components/ui/card';
import { useState, useEffect } from 'react';
import RecentPostsList from './recent-posts-list';

export default function RecentPostsWidget({
  posts = [],
  locale = 'en',
  maxPosts = 5,
}) {
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
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Loading recent posts...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {translations.recentPosts?.title || 'Recent Posts'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length > 0 ? (
          <RecentPostsList
            posts={posts}
            locale={locale}
            maxPosts={maxPosts}
          />
        ) : (
          <p className='text-sm text-muted-foreground'>
            {translations.recentPosts?.noPosts || 'No recent posts.'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
