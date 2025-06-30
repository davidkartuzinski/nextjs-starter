'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/cms-core/components/ui/card';
import { Badge } from '@/cms-core/components/ui/badge';
import { Input } from '@/cms-core/components/ui/input';
import { Button } from '@/cms-core/components/ui/button';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AboutWidget from '@/user-content/components/sidebar/optional/about-widget';

export default function Sidebar({
  recentPosts = [],
  categories = [],
  locale = 'en',
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/${locale}/blog/search?q=${encodeURIComponent(searchQuery)}`
      );
    }
  };

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
      <Card>
        <CardHeader>
          <CardTitle>
            {translations.search?.title || 'Search'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSearch}
            className='flex w-full items-center space-x-2'
          >
            <Input
              type='search'
              placeholder={
                translations.search?.placeholder || 'Search blog...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type='submit' size='icon'>
              <Search className='h-4 w-4' />
              <span className='sr-only'>
                {translations.search?.button || 'Search'}
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <AboutWidget locale={locale} />

      <Card>
        <CardHeader>
          <CardTitle>
            {translations.recentPosts?.title || 'Recent Posts'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentPosts.length > 0 ? (
            <ul className='space-y-3'>
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className='text-sm font-medium hover:underline'
                  >
                    {post.title}
                  </Link>
                  <p className='text-xs text-muted-foreground'>
                    {post.date}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-muted-foreground'>
              {translations.recentPosts?.noPosts ||
                'No recent posts.'}
            </p>
          )}
        </CardContent>
      </Card>

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
                  href={`/${locale}/blog/category/${category.slug}`}
                >
                  {category.name}
                </Link>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
