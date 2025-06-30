'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/cms-core/components/ui/card';
import { Badge } from '@/cms-core/components/ui/badge';
import { useState, useEffect } from 'react';
import { getTagUrl } from '@/cms-core/lib/i18n/tag-utils';

export default function TagWidget({
  tags = [],
  locale = 'en',
  minPostCount = 1,
}) {
  const [translations, setTranslations] = useState({});
  const [tagUrls, setTagUrls] = useState({});
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

  useEffect(() => {
    async function loadTagUrls() {
      try {
        const urls = {};
        if (tags) {
          for (const tag of tags) {
            urls[tag.slug] = await getTagUrl(tag.slug, locale);
          }
        }
        setTagUrls(urls);
      } catch (error) {
        console.error('Error loading tag URLs:', error);
        // Fallback to simple URLs
        const fallbackUrls = {};
        if (tags) {
          tags.forEach((tag) => {
            fallbackUrls[
              tag.slug
            ] = `/${locale}/blog/tag/${tag.slug}`;
          });
        }
        setTagUrls(fallbackUrls);
      }
    }

    loadTagUrls();
  }, [tags, locale]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Loading tags...
          </p>
        </CardContent>
      </Card>
    );
  }

  // Filter tags based on minimum post count
  const filteredTags = tags.filter(
    (tag) => (tag.postCount || 0) >= minPostCount
  );

  if (!filteredTags || filteredTags.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.tags?.title || 'Tags'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-2'>
          {filteredTags.map((tag) => (
            <Link
              key={tag.slug}
              href={
                tagUrls[tag.slug] || `/${locale}/blog/tag/${tag.slug}`
              }
              className='inline-block'
            >
              <Badge
                variant='secondary'
                className='hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer'
                title={`${tag.postCount || 0} post${
                  (tag.postCount || 0) !== 1 ? 's' : ''
                }`}
              >
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
