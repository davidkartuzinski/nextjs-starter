'use client';

import Link from 'next/link';
import { Toggle } from '@/components/ui/toggle';
import MainNav from './MainNav';
import MobileNav from './MobileNav';
import SocialFollowMe from '../optional/social-follow-me';
import { Logo, SiteName } from '@/app/site-config';

export default function Header({ option = 1 }) {
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
        {option === 2 && (
          <div className='absolute left-1/2 transform -translate-x-1/2 hidden md:flex'>
            <MainNav />
          </div>
        )}

        {/* Right: */}
        <div className='flex items-center gap-4'>
          {option === 1 && (
            <div className='hidden md:flex'>
              <MainNav />
            </div>
          )}
          {option === 2 && (
            <div className='hidden md:flex items-center gap-4'>
              <SocialFollowMe />
              <Toggle />
            </div>
          )}
          {/* Mobile menu trigger */}
          <div className='md:hidden'>
            <MobileNav option={2} />
          </div>
        </div>
      </div>
    </header>
  );
}
