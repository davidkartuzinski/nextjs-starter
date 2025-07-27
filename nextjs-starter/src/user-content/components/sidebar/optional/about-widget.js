'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../../cms-core/components/ui/card';
import { Button } from '../../../../../cms-core/components/ui/button';
import { useEffect, useState } from 'react';

export default function AboutWidget({ locale }) {
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
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground mb-4'>
            Loading...
          </p>
          <Button variant='outline' disabled>
            Learn more
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.about?.title || 'About'}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground mb-4'>
          {translations.about?.description ||
            'A brief description about yourself or your blog.'}
        </p>
        <Button variant='outline' asChild>
          <Link href={`/${locale}/about`}>
            {translations.about?.learnMore || 'Learn more'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
