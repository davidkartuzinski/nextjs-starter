import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import RecentPostsSection from '@/components/home/RecentPostsSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import ParallaxHalfPageSection from '@/components/home/ParallaxHalfPageSection';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CallToActionSection />

      {/* <section className='grid grid-cols-1 md:grid-cols-3 gap-8 py-20 px-8 max-w-7xl mx-auto'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className='rounded-lg border p-6 text-center shadow-sm hover:shadow-md transition'
          >
            <h3 className='text-2xl font-semibold mb-4'>
              Feature {i + 1}
            </h3>
            <p className='text-muted-foreground'>
              Short description about this awesome feature you offer.
            </p>
          </div>
        ))}
      </section> */}
      {/* <section className='relative bg-background py-20'>
        <div className='container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'> */}
      {/* Left: Text content */}
      {/* <div className='space-y-10'>
            <h1 className='text-4xl font-serif font-bold leading-tight text-foreground'>
              Personal space for the open office —
            </h1>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-2'>
                <h2 className='text-2xl font-bold text-primary'>
                  Stunning
                </h2>
                <p className='text-muted-foreground'>
                  Make a statement that will last a lifetime with our
                  pieces.
                </p>
              </div>

              <div className='space-y-2'>
                <h2 className='text-2xl font-bold text-primary'>
                  Comfy
                </h2>
                <p className='text-muted-foreground'>
                  You do not have to sacrifice feeling cozy for
                  looking good.
                </p>
              </div>

              <div className='space-y-2'>
                <h2 className='text-2xl font-bold text-primary'>
                  Sustainable
                </h2>
                <p className='text-muted-foreground'>
                  We strive to make our products out of 100%
                  recyclable goods.
                </p>
              </div>

              <div className='space-y-2'>
                <h2 className='text-2xl font-bold text-primary'>
                  Stylish
                </h2>
                <p className='text-muted-foreground'>
                  Contemporary lines and a modern finish make for a
                  beautiful home.
                </p>
              </div>
            </div>
          </div> */}
      {/* Right: Background Image */}
      {/* <div className='relative w-full h-[600px]'>
            <div
              className='absolute inset-0 bg-cover bg-center rounded-lg'
              style={{
                backgroundImage: "url('/images/dummy_1450x950.png')",
                backgroundPosition: '100% 50%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        </div>
      </section> */}
      {/* <section className='relative bg-blue-100 py-24'> */}
      {/* SVG Shape Divider */}
      {/* <div className='absolute bottom-0 left-0 w-full overflow-hidden leading-none'>
          <svg
            className='relative block w-[calc(100%+1.3px)] h-[100px]'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='none'
            viewBox='0 0 1200 100'
          >
            <path
              d='M1200 100H0V0l400 77.2L1200 0z'
              className='fill-blue-100'
            ></path>
          </svg>
        </div>
      </section> */}
      {/* Big CTA Banner */}
      {/* <section className='relative bg-blue-100 py-24'>
        <div className='container mx-auto flex flex-col items-center text-center px-4'>
          <h2 className='text-4xl font-bold mb-4'>
            Ready to Build Your Future?
          </h2>
          <p className='mb-8 max-w-2xl text-muted-foreground'>
            Let’s work together to create something amazing.
          </p>
          <Link
            href='/contact'
            className='rounded-md bg-primary px-6 py-3 text-white hover:bg-primary/90 transition'
          >
            Contact Us
          </Link>
        </div>
      </section>

      <ParallaxHalfPageSection /> */}
      {/* <section className='py-16 bg-background'>
        <div className='container mx-auto flex flex-col-reverse items-center gap-12 px-4 md:flex-row md:gap-20'> */}
      {/* Left side: Text */}
      {/* <div className='text-center md:text-left md:w-1/2'>
            <h2 className='text-4xl font-bold tracking-tight mb-4'>
              Empower Your E-commerce Business
            </h2>
            <p className='text-muted-foreground mb-6'>
              We help you launch, grow, and scale your store with
              cutting-edge strategies and solutions.
            </p>
            <a
              href='/contact'
              className='inline-block rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/80 transition-colors'
            >
              Get Started
            </a>
          </div> */}
      {/* Right side: Image */}
      {/* <div className='w-full md:w-1/2'>
            <img
              src='https://placehold.co/600x400?text=Your+Image'
              alt='Ecommerce Illustration'
              className='mx-auto rounded-lg shadow-lg'
            />
          </div>
        </div>
      </section>
      <section className='relative overflow-hidden py-16 bg-background'> */}
      {/* Dots background */}
      {/* <div className='absolute inset-0 pointer-events-none opacity-20 z-0'>
          <div
            className='h-full w-full bg-no-repeat bg-left-top bg-[length:240px]'
            style={{ backgroundImage: "url('/dots-1.svg')" }}
          ></div>
        </div> */}
      {/* Section content */}
      {/* <div className='relative z-10 container mx-auto px-4'>
          <img
            src='https://placehold.co/600x400'
            alt='Example image'
            className='mx-auto'
          />
          <h2 className='text-3xl font-bold text-center mt-8'>
            Section Title
          </h2>
          <p className='mt-4 text-center text-muted-foreground max-w-2xl mx-auto'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam voluptatum, quibusdam voluptate.
          </p>
        </div>
      </section> */}
      {/* <section className='py-16 bg-background'>
        <div className='relative container mx-auto flex flex-col-reverse items-center gap-12 px-4 md:flex-row md:gap-20'>
          {/* Dots background */}
      {/* <div
        className='absolute pointer-events-none opacity-20 z-0'
        style={{
          inset: 'calc(var(--spacing) * -8)',
          top: 'calc(var(--spacing) * -26)',
        }}
      >
        <div
          className='h-full w-full bg-no-repeat '
          style={{
            backgroundSize: '240px',

            backgroundImage: "url('/dots-1.svg')",
          }}
        ></div>
      </div>{' '} */}
      {/* left side: Image */}
      {/* <div className='relative z-10 w-full md:w-1/2'>
            <img
              src='https://placehold.co/600x400?text=Your+Image'
              alt='Ecommerce Illustration'
              className='mx-auto rounded-lg shadow-lg'
            />
          </div> */}
      {/* right side: Text */}
      {/* <div className='text-center md:text-left md:w-1/2'>
            <h2 className='text-4xl font-bold tracking-tight mb-4'>
              Empower Your E-commerce Business
            </h2>
            <p className='text-muted-foreground mb-6'>
              We help you launch, grow, and scale your store with
              cutting-edge strategies and solutions.
            </p>
            <a
              href='/contact'
              className='inline-block rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/80 transition-colors'
            >
              Get Started
            </a>
          </div>
        </div>
      </section> */}
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

      <FeaturesSection />
      <RecentPostsSection />
      */}
    </>
  );
}
