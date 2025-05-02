// src/components/home/LogoColumns.js

import Image from 'next/image';

export default function LogoColumns({
  heading = 'Know our logos',
  logos = [],
  className = '',
}) {
  if (!logos || logos.length < 2) return null;

  const isInlineLayout = logos.length <= 3;

  return (
    <section className={`relative bg-muted/20 py-20 ${className}`}>
      <div className='container mx-auto'>
        {isInlineLayout ? (
          // Inline layout for 2–3 logos
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 items-center'>
            <div className='md:col-span-1 flex justify-center md:justify-start'>
              <h2 className='text-2xl md:text-3xl font-bold text-primary'>
                {heading}
              </h2>
            </div>
            {logos.map((logo, index) => (
              <div key={index} className='flex justify-center'>
                <Image
                  src={logo.src}
                  alt={logo.alt || `Logo ${index + 1}`}
                  width={300}
                  height={100}
                  className='object-contain'
                />
              </div>
            ))}
          </div>
        ) : (
          // Stacked layout for 4+ logos
          <div className='space-y-8'>
            <h2 className='text-3xl font-bold text-center text-foreground'>
              {heading}
            </h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center justify-items-center'>
              {logos.map((logo, index) => (
                <div key={index} className='flex justify-center'>
                  <Image
                    src={logo.src}
                    alt={logo.alt || `Logo ${index + 1}`}
                    width={300}
                    height={100}
                    className='object-contain'
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
