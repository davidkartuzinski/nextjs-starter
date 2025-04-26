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

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side='left' className='px-6 pt-6 pb-8'>
        <SheetHeader>
          <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
        </SheetHeader>

        <div className='mb-8'>
          <Link
            href='/'
            onClick={() => setOpen(false)}
            className='text-xl font-bold tracking-tight'
          >
            Your Site Name
          </Link>
        </div>

        <nav className='flex flex-col gap-4'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'text-muted-foreground transition-colors hover:text-foreground text-lg font-medium',
                pathname === item.href && 'text-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
