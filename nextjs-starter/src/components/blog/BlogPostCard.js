import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import slugify from 'react-slugify';

export default function BlogPostCard({ post }) {
  // Check if the post has a hero image
  const heroImagePath = `/images/posts/${post.slug}/hero-image.jpg`;
  const heroImageExists = fs.existsSync(
    path.join(process.cwd(), 'public', heroImagePath)
  );

  // Fallback image if no hero image exists
  const featuredImage = heroImageExists
    ? heroImagePath
    : post.coverImage || '/images/blog-placeholder.png';

  return (
    <Card className='flex h-full flex-col overflow-hidden'>
      {featuredImage && (
        <div className='aspect-video w-full overflow-hidden'>
          <Image
            src={featuredImage}
            alt={post.title}
            width={600}
            height={340}
            className='h-full w-full object-cover transition-transform hover:scale-105'
          />
        </div>
      )}
      <CardHeader className='flex-1'>
        <div className='space-y-1'>
          {post.categories?.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {post.categories.filter(Boolean).map((cat) => {
                const key = typeof cat === 'object' ? cat.id : cat;
                const label =
                  typeof cat === 'object' ? cat.name : cat;
                const slug =
                  typeof cat === 'object' ? cat.slug : slugify(cat);

                return (
                  <Badge key={key} variant='secondary'>
                    <Link href={`/blog/category/${slug}`}>
                      {label || 'Unnamed'}
                    </Link>
                  </Badge>
                );
              })}
            </div>
          )}
          <CardTitle>
            <Link
              href={`/blog/${post.slug}`}
              className='hover:underline'
            >
              {post.title}
            </Link>
          </CardTitle>
          <CardDescription className='flex items-center text-xs'>
            <CalendarIcon className='mr-1 h-3 w-3' />
            {new Date(post.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground line-clamp-3'>
          {post.summary}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant='ghost' size='sm' className='w-full'>
          <Link href={`/blog/${post.slug}`}>Read more</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
