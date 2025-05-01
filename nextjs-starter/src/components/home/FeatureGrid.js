'use client';

import Link from 'next/link';
import Image from 'next/image';

// Icons from Lucide - https://lucide.dev/icons/

import * as Icons from 'lucide-react';

export default function FeatureGrid({ features }) {
  return (
    <section className='grid grid-cols-1 md:grid-cols-3 gap-8 py-20 px-8 max-w-7xl mx-auto'>
      {features.map((feature, i) => {
        const LucideIcon = Icons[feature.icon]; // Pull the icon by string

        return (
          <div
            key={i}
            className='rounded-lg border p-6 text-center shadow-sm hover:shadow-md transition'
          >
            {LucideIcon && (
              <div className='mb-4 flex justify-center text-primary'>
                <LucideIcon className='h-8 w-8' />
              </div>
            )}

            <h3 className='text-2xl font-semibold mb-4'>
              {feature.title}
            </h3>

            <p className='text-muted-foreground mb-4'>
              {feature.description}
            </p>

            {feature.link && feature.linkText && (
              <Link
                href={feature.link}
                className='text-primary hover:underline text-sm font-medium'
              >
                {feature.linkText}
              </Link>
            )}
          </div>
        );
      })}
    </section>
  );
}
