'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { locales, nativeNames } from '@/cms-core/lib/i18n/config';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/cms-core/components/ui/dropdown-menu';
import { Button } from '@/cms-core/components/ui/button';

export default function LanguageSwitcher({
  closeMenu,
  labelLanguageOption = 2,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentLocale = pathname.split('/')[1];
  const restOfPath = pathname.replace(`/${currentLocale}`, '') || '/';

  const handleLocaleChange = (locale) => {
    if (locale === currentLocale) return;
    startTransition(() => {
      router.push(`/${locale}${restOfPath}`);
      if (typeof closeMenu === 'function') {
        closeMenu();
      }
    });
  };

  const getLabel = (locale) =>
    labelLanguageOption === 2
      ? nativeNames[locale] || locale
      : locale.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='px-2 text-xs md:text-sm max-w-24 md:max-w-28 truncate'
          disabled={isPending}
        >
          {getLabel(currentLocale)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-32 md:w-40 mx-4 md:mx-0'
      >
        <DropdownMenuLabel className='text-xs'>
          {labelLanguageOption === 2 ? 'Select Language' : 'LANG'}
        </DropdownMenuLabel>
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onSelect={() => handleLocaleChange(locale)}
            className={
              locale === currentLocale
                ? 'font-semibold text-xs'
                : 'text-xs'
            }
          >
            {getLabel(locale)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
