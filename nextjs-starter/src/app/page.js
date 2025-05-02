import HeroSection from '@/components/home/HeroSection';
import BlogPosts from '@/components/home/BlogPosts';

import FeatureGrid from '@/components/home/FeatureGrid';
import SplitSection from '@/components/home/SplitSection';
import CallToAction from '@/components/optional/CallToAction';
import CallToActionWithPicture from '@/components/optional/CallToActionWithPicture';
import { Features, SplitSectionFeatures } from './site-config';
import CenterTitlePicture from '@/components/optional/CenterTitlePicture';
import LogoColumns from '@/components/optional/LogoColumns';
import { logos } from './site-config';
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
      <LogoColumns heading='Our Logos' logos={logos} />;
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
    </>
  );
}
