'use client';

import Link from 'next/link';
import { Toggle } from '@/cms-core/components/ui/toggle';
import MainNav from './MainNav';
import MobileNav from './MobileNav';
import SocialFollowMe from '../optional/social-follow-me';
import { Logo, SiteName } from '@/app/site-config';
import LanguageSwitcher from '../optional/LanguageSwitcher';

export default function Header({
  menuOption = 1,
  mobileOption = 1,
  labelLanguageOption,
}) {
  return (
    <header className='sticky top-0 z-50 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-24 items-center justify-between px-5 md:px-8 max-w-6xl mx-auto'>
        {/* Left: Logo */}
        <Link
          href='/'
          className='flex items-center space-x-2 font-bold text-lg'
        >
          {Logo ? Logo : SiteName}
        </Link>

        {/* Center: MainNav if option 2 */}
        {menuOption === 2 && (
          <div className='absolute left-1/2 transform -translate-x-1/2 hidden md:flex'>
            <MainNav />
          </div>
        )}

        {/* Right: */}
        <div className='flex items-center gap-4'>
          {menuOption === 1 && (
            <div className='hidden md:flex items-center gap-x-4'>
              <MainNav />
              <LanguageSwitcher
                labelLanguageOption={labelLanguageOption}
              />
            </div>
          )}
          {menuOption === 2 && (
            <div className='hidden md:flex items-center gap-4'>
              <SocialFollowMe />
              <Toggle />
              <LanguageSwitcher
                labelLanguageOption={labelLanguageOption}
              />
            </div>
          )}
          {/* Mobile menu trigger */}
          <div className='md:hidden'>
            <MobileNav
              mobileOption={mobileOption}
              labelLanguageOption={labelLanguageOption}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
