// components/optional/CallToAction.js
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CallToAction({
  title = 'Ready to Build Your Future?',
  description = 'Let’s work together to create something amazing.',
  buttonText = 'Contact Us',
  buttonLink = '/contact',
  backgroundClass = 'bg-blue-100',
  className = '',
}) {
  return (
    <section
      className={cn('relative py-24', backgroundClass, className)}
    >
      <div className='container mx-auto flex flex-col items-center text-center px-4'>
        <h2 className='text-4xl font-bold mb-4'>{title}</h2>
        <p className='mb-8 max-w-2xl text-muted-foreground'>
          {description}
        </p>
        <Link
          href={buttonLink}
          className='bg-primary px-6 py-3 text-white hover:bg-primary/90 transition'
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
