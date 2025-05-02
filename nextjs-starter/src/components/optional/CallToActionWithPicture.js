// components/optional/CallToActionWithPicture.js

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CallToActionWithPicture({
  title = 'Empower Your E-commerce Business',
  description = 'We help you launch, grow, and scale your store with cutting-edge strategies and solutions.',
  buttonText = 'Get Started',
  buttonLink = '/contact',
  imageSrc = 'https://placehold.co/600x400?text=Your+Image',
  imageAlt = 'Illustration',
  imagePosition = 'right', // or 'left'
}) {
  const isImageLeft = imagePosition === 'left';

  return (
    <section className='py-16 bg-background'>
      <div
        className={cn(
          'container mx-auto flex flex-col items-center gap-12 px-4 md:flex-row md:gap-20',
          isImageLeft && 'md:flex-row-reverse'
        )}
      >
        {/* Text Content */}
        <div className='text-center md:text-left md:w-1/2'>
          <h2 className='text-4xl font-bold tracking-tight mb-4'>
            {title}
          </h2>
          <p className='text-muted-foreground mb-6'>{description}</p>
          <Link
            href={buttonLink}
            className='inline-block bg-primary px-6 py-3 text-white hover:bg-primary/80 transition-colors'
          >
            {buttonText}
          </Link>
        </div>

        {/* Image */}
        <div className='w-full md:w-1/2'>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={600}
            height={400}
            className='mx-auto shadow-lg'
          />
        </div>
      </div>
    </section>
  );
}
