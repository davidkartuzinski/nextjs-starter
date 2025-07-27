'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../../cms-core/components/ui/card';
import { Input } from '../../../../../cms-core/components/ui/input';
import { Button } from '../../../../../cms-core/components/ui/button';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchWidget({ locale }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
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
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex w-full items-center space-x-2'>
            <Input type='search' placeholder='Loading...' disabled />
            <Button type='submit' size='icon' disabled>
              <Search className='h-4 w-4' />
              <span className='sr-only'>Search</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
  );
}
