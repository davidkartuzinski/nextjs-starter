'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/cms-core/components/ui/sheet';
import { Button } from '@/cms-core/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/cms-core/lib/utils';
import { SiteName, Logo } from '@/app/site-config';
import SocialFollowMe from '@/cms-core/components/optional/social-follow-me';
import LanguageSwitcher from '@/cms-core/components/optional/LanguageSwitcher';
import { useEffect } from 'react';

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

export default function TranslatedMobileNav({
  locale,
  mobileOption = 1,
  labelLanguageOption,
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      try {
        // Import the translation file dynamically
        const module = await import(
          `@/cms-core/translations/${locale}/navigation.json`
        );
        setTranslations(module.default);
      } catch (error) {
        console.warn(
          `Failed to load navigation translations for ${locale}:`,
          error
        );
        // Fallback to English
        try {
          const fallbackModule = await import(
            '@/cms-core/translations/en/navigation.json'
          );
          setTranslations(fallbackModule.default);
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <Menu className='h-6 w-6' />
          <span className='sr-only'>Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side='left' className='px-6 pt-6 pb-10'>
        <SheetHeader>
          <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
        </SheetHeader>

        <div className='mb-8 flex items-center'>
          <Link
            href={`/${locale}`}
            onClick={() => setOpen(false)}
            className='text-2xl font-bold tracking-tight'
          >
            {Logo ? Logo : SiteName}
          </Link>
        </div>

        <nav className='flex flex-col gap-6 mb-8'>
          {NavStructure.map((item, idx) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              onClick={() => setOpen(false)}
              className={cn(
                'transition-all duration-300 text-lg font-medium',
                pathname === `/${locale}${item.href}` ||
                  (item.href === '/' && pathname === `/${locale}`)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              style={{
                transform: open
                  ? 'translateX(0)'
                  : 'translateX(-10px)',
                opacity: open ? 1 : 0,
                transitionDelay: `${idx * 50}ms`,
              }}
            >
              {loading
                ? item.key
                : translations.navigation?.[item.key] || item.key}
            </Link>
          ))}
          <LanguageSwitcher
            labelLanguageOption={labelLanguageOption}
          />
        </nav>

        {mobileOption === 2 && (
          <div className='mt-6'>
            <SocialFollowMe />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
