// src/components/home/FeaturesSection.js

import Image from 'next/image';

const features = [
  {
    title: 'Expert Insights',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    img: '/images/dummy_100x100.png',
  },
  {
    title: 'Actionable Tutorials',
    description:
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    img: '/images/dummy_100x100.png',
  },
  {
    title: 'Industry News',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    img: '/images/dummy_100x100.png',
  },
];

export default function FeaturesSection() {
  return (
    <section className='py-20 bg-muted/20'>
      <div className='container grid gap-12 md:grid-cols-3'>
        {features.map((feature, index) => (
          <div
            key={index}
            className='flex flex-col items-center text-center space-y-4'
          >
            <Image
              src={feature.img}
              alt={feature.title}
              width={100}
              height={100}
              className='rounded-full'
            />
            <h3 className='text-xl font-semibold'>{feature.title}</h3>
            <p className='text-muted-foreground'>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
