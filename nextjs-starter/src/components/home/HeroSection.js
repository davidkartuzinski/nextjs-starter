import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection({
  title,
  description,
  buttonText,
  buttonLink,
}) {
  return (
    <section className='w-full'>
      <div className='container mx-auto px-4 flex flex-col items-center justify-center text-center space-y-6 py-20 max-w-6xl'>
        <h1 className='text-5xl font-bold leading-tight max-w-3xl'>
          {title}
        </h1>
        <p className='text-muted-foreground max-w-xl text-lg'>
          {description}
        </p>
        <Button asChild size='lg'>
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
      </div>
    </section>
  );
}
