'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { useEffect, useState } from 'react';

// Navigation structure with translation keys
const NavStructure = [
  {
    key: 'home',
    href: '/',
  },
  {
    key: 'blog',
    href: '/blog',
  },
  {
    key: 'about',
    href: '/about',
  },
  {
    key: 'contact',
    href: '/contact',
  },
];

export default function TranslatedNav({ locale }) {
  const pathname = usePathname();
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      try {
        // Import the translation file dynamically
        const navigationTranslations = await import(
          `../../translations/${locale}/navigation.json`
        );
        setTranslations(navigationTranslations.default);
      } catch (error) {
        console.warn(
          `Failed to load navigation translations for ${locale}:`,
          error
        );
        // Fallback to English
        try {
          const fallbackTranslations = await import(
            '../../translations/en/navigation.json'
          );
          setTranslations(fallbackTranslations.default);
        } catch (fallbackError) {
          console.error(
            'Failed to load fallback navigation translations:',
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
      <nav className='flex items-center space-x-6 text-base font-medium'>
        {NavStructure.map((item) => (
          <div key={item.href} className='text-foreground/60'>
            {item.key}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className='flex items-center space-x-6 text-base font-medium'>
      {NavStructure.map((item) => (
        <Link
          key={item.href}
          href={`/${locale}${item.href}`}
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === `/${locale}${item.href}` ||
              (item.href === '/' && pathname === `/${locale}`)
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          {translations.navigation?.[item.key] || item.key}
        </Link>
      ))}
    </nav>
  );
}
