import Image from 'next/image';
import FloatingBackgroundIcon from '@/components/optional/FloatingBackgroundIcon';

export default function CenterTitlePicture({
  title,
  description,
  imageUrl,
  imageAlt = '',
}) {
  return (
    <section className='relative overflow-hidden py-16 bg-background'>
      {/* Decorative Dots */}
      <FloatingBackgroundIcon
        top={0}
        left={110}
        zIndex={0}
        position='left'
        size={240}
        opacity={0.2}
        image={'/boxes.svg'}
      />

      {/* Section Content */}
      <div className='relative z-10 container mx-auto px-4 max-w-4xl text-center'>
        <div className='relative w-full max-w-[800px] mx-auto'>
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={800}
            height={500}
            className='mx-auto shadow-lg object-cover'
          />
          <div className='absolute inset-0 bg-black/20 '></div>
        </div>
        <div className='absolute inset-0 flex flex-col justify-center items-center px-4 text-white'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            {title}
          </h2>
          <p className='max-w-2xl text-sm md:text-base text-center'>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
