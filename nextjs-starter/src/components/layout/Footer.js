import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className=' border-t py-12 mt-12'>
      {/* <div className='container grid grid-cols-1 gap-10 md:grid-cols-4'> */}
      <div className='grid grid-cols-1 gap-10 text-center md:grid-cols-4 md:text-left max-w-6xl mx-auto '>
        <div className='flex flex-col gap-3'>
          <Link href='/' className='font-bold text-lg'>
            NextJs Starter
          </Link>
          <p className='text-sm text-muted-foreground'>
            A brief description of your website or blog.
          </p>
        </div>
        <div>
          <h3 className='font-semibold mb-2'>Links</h3>
          <ul className='flex flex-col gap-1 text-sm text-muted-foreground'>
            <li>
              <Link href='/' className='hover:text-foreground'>
                Home
              </Link>
            </li>
            <li>
              <Link href='/blog' className='hover:text-foreground'>
                Blog
              </Link>
            </li>
            <li>
              <Link href='/about' className='hover:text-foreground'>
                About
              </Link>
            </li>
            <li>
              <Link href='/contact' className='hover:text-foreground'>
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className='font-semibold mb-2'>Categories</h3>
          <ul className='flex flex-col gap-1 text-sm text-muted-foreground'>
            <li>
              <Link
                href='/blog/category/technology'
                className='hover:text-foreground'
              >
                Technology
              </Link>
            </li>
            <li>
              <Link
                href='/blog/category/programming'
                className='hover:text-foreground'
              >
                Programming
              </Link>
            </li>
            <li>
              <Link
                href='/blog/category/design'
                className='hover:text-foreground'
              >
                Design
              </Link>
            </li>
            <li>
              <Link
                href='/blog/category/tutorials'
                className='hover:text-foreground'
              >
                Tutorials
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className='font-semibold mb-2'>Connect</h3>
          <ul className='flex flex-col gap-1 text-sm text-muted-foreground'>
            <li>
              <a
                href='#'
                className='hover:text-foreground'
                target='_blank'
                rel='noopener noreferrer'
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href='#'
                className='hover:text-foreground'
                target='_blank'
                rel='noopener noreferrer'
              >
                X
              </a>
            </li>
            <li>
              <a
                href='#'
                className='hover:text-foreground'
                target='_blank'
                rel='noopener noreferrer'
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        {/* privacy footer */}
      </div>
      <div>
        <Separator className='my-8' />
      </div>
      <div className='max-w-6xl mx-auto mt-8 flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground md:flex-row md:gap-4'>
        <p className='text-center md:text-left'>
          © {new Date().getFullYear()} NextJs Starter. All rights
          reserved.
        </p>
        <div className='flex items-center gap-4'>
          <Link
            href='/privacy'
            className='transition-colors hover:text-primary'
          >
            Privacy Policy
          </Link>
          <span>|</span>
          <Link
            href='/terms'
            className='transition-colors hover:text-primary'
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
