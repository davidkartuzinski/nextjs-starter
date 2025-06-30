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

export default function CategoryWidget({
  categories = [],
  locale = 'en',
}) {
  const [translations, setTranslations] = useState({});
  const [categoryUrls, setCategoryUrls] = useState({});
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
      }
    }

    async function loadCategoryUrls() {
      try {
        const { getCategoryUrl } = await import(
          '@/cms-core/lib/i18n/category-utils'
        );
        const urls = {};

        for (const category of categories) {
          urls[category.slug] = await getCategoryUrl(
            category.slug,
            locale
          );
        }

        setCategoryUrls(urls);
      } catch (error) {
        console.error('Error loading category URLs:', error);
        // Fallback to simple URLs
        const fallbackUrls = {};
        categories.forEach((category) => {
          fallbackUrls[
            category.slug
          ] = `/${locale}/blog/category/${category.slug}`;
        });
        setCategoryUrls(fallbackUrls);
      } finally {
        setLoading(false);
      }
    }

    loadTranslations();
    loadCategoryUrls();
  }, [locale, categories]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Loading categories...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {translations.categories?.title || 'Categories'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-2'>
          {categories.map((category) => (
            <Badge key={category.slug} variant='outline' asChild>
              <Link
                href={
                  categoryUrls[category.slug] ||
                  `/${locale}/blog/category/${category.slug}`
                }
              >
                {category.name}
              </Link>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
