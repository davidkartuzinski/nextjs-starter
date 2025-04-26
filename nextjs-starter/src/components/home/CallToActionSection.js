// src/components/home/CallToActionSection.js

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CallToActionSection() {
  return (
    <section className='py-20 bg-primary text-primary-foreground text-center space-y-6'>
      <h2 className='text-4xl font-bold'>Stay Updated</h2>
      <p className='max-w-2xl mx-auto'>
        Subscribe to our newsletter to get the latest updates and
        articles straight to your inbox.
      </p>
      <Button variant='secondary' size='lg' asChild>
        <Link href='/newsletter'>Join the Newsletter</Link>
      </Button>
    </section>
  );
}
