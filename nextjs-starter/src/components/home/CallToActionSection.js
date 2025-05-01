// src/components/home/CallToActionSection.js

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CallToActionSection({
  title = 'Stay Updated',
  description = 'Subscribe to our newsletter to get the latest updates and articles straight to your inbox.',
  buttonText = 'Join the Newsletter',
  buttonLink = '/newsletter',
}) {
  return (
    <section className='py-20 bg-primary text-primary-foreground text-center space-y-6 px-4 sm:px-6'>
      <h2 className='text-4xl font-bold'>{title}</h2>
      <p className='max-w-2xl mx-auto'>{description}</p>
      <Button variant='secondary' size='lg' asChild>
        <Link href={buttonLink}>{buttonText}</Link>
      </Button>
    </section>
  );
}
