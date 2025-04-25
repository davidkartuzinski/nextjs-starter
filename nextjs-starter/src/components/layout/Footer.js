import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className='border-t py-8 md:py-12'>
      <div className='container flex flex-col gap-8 md:flex-row md:gap-16'>
        <div className='flex flex-col gap-2'>
          <Link href='/' className='font-bold'>
            Your Site Name
          </Link>
          <p className='text-sm text-muted-foreground'>
            A brief description of your website or blog.
          </p>
        </div>

        <div className='grid flex-1 grid-cols-1 gap-8 sm:grid-cols-3'>
          <div className='flex flex-col gap-2'>
            <h3 className='font-medium'>Links</h3>
            <ul className='flex flex-col gap-2 text-sm text-muted-foreground'>
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
                <Link
                  href='/contact'
                  className='hover:text-foreground'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className='flex flex-col gap-2'>
            <h3 className='font-medium'>Categories</h3>
            <ul className='flex flex-col gap-2 text-sm text-muted-foreground'>
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

          <div className='flex flex-col gap-2'>
            <h3 className='font-medium'>Connect</h3>
            <ul className='flex flex-col gap-2 text-sm text-muted-foreground'>
              <li>
                <a href='#' className='hover:text-foreground'>
                  Twitter
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground'>
                  GitHub
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground'>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator className='my-8' />

      <div className='container flex flex-col items-center justify-between gap-4 md:flex-row'>
        <p className='text-center text-sm text-muted-foreground'>
          © {new Date().getFullYear()} Your Site Name. All rights
          reserved.
        </p>
        <div className='flex gap-4'>
          <Link
            href='/privacy'
            className='text-sm text-muted-foreground hover:text-foreground'
          >
            Privacy Policy
          </Link>
          <Link
            href='/terms'
            className='text-sm text-muted-foreground hover:text-foreground'
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
