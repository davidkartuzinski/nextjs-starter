import HeroSection from '@/components/home/HeroSection';
import BlogPosts from '@/components/home/BlogPosts';

import FeatureGrid from '@/components/home/FeatureGrid';
import SplitSection from '@/components/home/SplitSection';
import CallToAction from '@/components/optional/CallToAction';
import CallToActionWithPicture from '@/components/optional/CallToActionWithPicture';
import { Features, SplitSectionFeatures } from './site-config';
import CenterTitlePicture from '@/components/optional/CenterTitlePicture';

export default function HomePage() {
  return (
    <>
      <HeroSection
        title={'Welcome to NextJS Starter Demo'}
        description={
          'Kickstart your modern web presence with a fast, flexible, and SEO-friendly Next.js boilerplate. Built with MDX, Supabase, Tailwind CSS, Shadcn UI, and the App Router — this starter gives you everything you need to publish, grow, and scale your content. Start creating. Customize freely. MIT Licensed. Deploy instantly.'
        }
        buttonText={'Read the Blog'}
        buttonLink={'/blog'}
      />

      <CallToActionWithPicture
        title='Start Your Journey Today'
        description='Everything you need to launch and grow your brand.'
        buttonText='Join Now'
        buttonLink='/signup'
        imageSrc='/images/dummy_600x400.png'
        imageAlt='Demo Illustration'
        imagePosition='right' // or 'right'
      />

      <CallToAction
        title={'Download the Starter'}
        description={
          'Get started with the Next.js Starter — a powerful foundation built for speed, flexibility, and scale. Whether you’re launching a blog, docs site, or personal brand, this stack is production-ready from day one.'
        }
        buttonText={'Download the Starter'}
        buttonLink={'/'}
      />

      <SplitSection
        title={'Split Section'}
        features={SplitSectionFeatures}
        imageUrl={'/images/dummy_720x600.png'}
        imageAlt={'Dummy Image'}
        imageLayout={'left'}
      />

      <FeatureGrid features={Features} />

      <BlogPosts />

      <SplitSection
        title={'Split Section'}
        features={SplitSectionFeatures}
        imageUrl={'/images/dummy_720x600.png'}
        imageAlt={'Dummy Image'}
        imageLayout={'left'}
      />

      <CenterTitlePicture
        title='Center Title Picture'
        description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatum, quibusdam voluptate.'
        imageUrl='/images/dummy_800x500.png'
        imageAlt='Dummy Image'
      />

      <BlogPosts title='Featured Posts' featured={true} />

      <CallToAction
        title='Join the Movement'
        description='Start building better web experiences with our Next.js Starter.'
        buttonText='Get Started'
        buttonLink='/get-started'
        backgroundClass='bg-yellow-100'
      />

      {/* <section className='relative bg-slate-50 py-20'>
        <div className='container mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 items-center'> */}
      {/* First column (50%) */}
      {/* <div className='md:col-span-2 flex justify-center md:justify-start'>
              <p className='text-lg font-serif text-primary uppercase tracking-wider'>
                Know our logos
              </p>
            </div> */}
      {/* Second column (25%) */}
      {/* <div className='flex justify-center'>
              <img
                src='/images/dummy_300x100.png'
                alt='temp image'
                width={300}
                height={100}
                className='object-contain'
              />
            </div> */}
      {/* Third column (25%) */}
      {/* <div className='flex justify-center'>
              <img
                src='/images/dummy_300x100.png'
                alt='temp image'
                width={300}
                height={100}
                className='object-contain'
              />
            </div>
          </div>
        </div>
      </section>



      */}
    </>
  );
}
