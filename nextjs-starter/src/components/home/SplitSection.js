import Image from 'next/image';
import clsx from 'clsx';

export default function SplitSection({
  title,
  features = [],
  imageUrl,
  imageAlt = '',
  imageLayout = 'right', // 'left' or 'right'
}) {
  const isImageLeft = imageLayout === 'left';

  return (
    <section className='relative bg-background py-20'>
      <div className='container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 sm:px-6'>
        {/* Text Column */}
        <div
          className={clsx('space-y-10', isImageLeft && 'lg:order-2')}
        >
          <h1 className='text-4xl font-serif font-bold leading-tight text-foreground'>
            {title}
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {features.map((feature, index) => (
              <div key={index} className='space-y-2'>
                <h2 className='text-2xl font-bold text-primary'>
                  {feature.title}
                </h2>
                <p className='text-muted-foreground'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Image Column */}
        <div
          className={clsx(
            'relative w-full h-[600px]',
            isImageLeft && 'lg:order-1'
          )}
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            className='object-cover '
            sizes='(max-width: 1024px) 100vw, 50vw'
          />
        </div>
      </div>
    </section>
  );
}
