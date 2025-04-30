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

// import Link from 'next/link';
// import { Button } from '@/components/ui/button';

// export default function HeroSection() {
//   return (
//     <section className='w-full bg-amber-400'>
//       <div className='container mx-auto px-4 flex flex-col items-center justify-center text-center space-y-6 py-20 max-w-6xl bg-primary'>
//         <h2 className='text-4xl font-bold'>Stay Updated</h2>
//         <p className='max-w-2xl mx-auto'>
//           Subscribe to our newsletter to get the latest updates and
//           articles straight to your inbox.
//         </p>
//         <Button variant='secondary' size='lg' asChild>
//           <Link href='/newsletter'>Join the Newsletter</Link>
//         </Button>
//       </div>
//     </section>
//   );
// }
