// src/components/home/HeroSection.js

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className='flex flex-col items-center justify-center text-center py-20 space-y-6'>
      <h1 className='text-5xl font-bold leading-tight max-w-3xl'>
        Welcome to Your Site Name
      </h1>
      <p className='text-muted-foreground max-w-xl text-lg'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Integer nec odio. Praesent libero.
      </p>
      <Button asChild size='lg'>
        <Link href='/blog'>Read the Blog</Link>
      </Button>
    </section>
  );
}
