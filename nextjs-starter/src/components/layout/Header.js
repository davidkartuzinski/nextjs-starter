import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import MainNav from './MainNav';
import MobileNav from './MobileNav';

export default function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center'>
        <Link href='/' className='mr-6 flex items-center space-x-2'>
          <span className='font-bold'>Your Site Name</span>
        </Link>
        <div className='hidden md:flex'>
          <MainNav />
        </div>
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='flex items-center space-x-2'>
            <Toggle />
            <Button variant='outline' asChild>
              <Link href='/blog'>Blog</Link>
            </Button>
          </nav>
        </div>
        <div className='md:hidden'>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
