'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ParallaxHalfPageSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section
      ref={ref}
      className='relative flex flex-col md:flex-row min-h-[80vh] items-center justify-between overflow-hidden'
    >
      {/* Text Content */}
      <div className='z-10 p-8 max-w-xl'>
        <h1 className='text-4xl md:text-5xl font-serif mb-4'>
          Personal space for the open office —
        </h1>
        <p className='text-lg text-muted-foreground mb-6'>
          Make a statement that will last a lifetime with our pieces.
        </p>
        <p className='text-lg text-muted-foreground'>
          Sustainable, stylish, and made for comfort.
        </p>
      </div>

      {/* Background Image */}
      <motion.div
        style={{
          backgroundImage: "url('/images/dummy_1450x950.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          y, // <- This adds the scroll movement
        }}
        className='absolute right-0 top-0 bottom-0 w-1/2'
      />
    </section>
  );
}
