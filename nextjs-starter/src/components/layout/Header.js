'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import MainNav from './MainNav';
import MobileNav from './MobileNav';

export default function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between max-w-6xl mx-auto '>
        <div className='flex items-center gap-6'>
          <Link
            href='/'
            className='flex items-center space-x-2 font-bold text-lg'
          >
            NextJs Starter
          </Link>
          <div className='hidden md:flex'>
            <MainNav />
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Toggle />
          <Button
            variant='outline'
            asChild
            className='hidden sm:inline-flex'
          >
            <Link href='/blog'>Blog</Link>
          </Button>
          <div className='md:hidden'>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
