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
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItems, SiteName, Logo } from '@/app/site-config';
import SocialFollowMe from '@/components/optional/social-follow-me'; // 👈 import your socials component

export default function MobileNav({ option = 1 }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
            href='/'
            onClick={() => setOpen(false)}
            className='text-2xl font-bold tracking-tight'
          >
            {Logo ? Logo : SiteName}
          </Link>
        </div>

        <nav className='flex flex-col gap-6 mb-8'>
          {NavItems.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'transition-all duration-300 text-lg font-medium',
                pathname === item.href
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
              {item.label}
            </Link>
          ))}
        </nav>

        {option === 2 && (
          <div className='mt-6'>
            <SocialFollowMe />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
