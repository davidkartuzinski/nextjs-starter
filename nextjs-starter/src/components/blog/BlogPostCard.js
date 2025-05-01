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
    : post.coverImage || '/images/posts/blog-placeholder.png';

  return (
    <Card className='flex flex-col justify-between h-full'>
      {featuredImage && (
        <div className='aspect-video w-full overflow-hidden'>
          <Link
            href={`/blog/${post.slug}`}
            className='hover:underline'
          >
            <Image
              src={featuredImage}
              alt={post.title}
              width={600}
              height={340}
              className='h-full w-full object-cover transition-transform hover:scale-105'
            />
          </Link>
        </div>
      )}
      <CardHeader className='flex-1'>
        <div className='min-h-[56px] space-y-1'>
          <CardTitle>
            <Link
              href={`/blog/${post.slug}`}
              className='hover:underline'
            >
              {post.title}
            </Link>
          </CardTitle>

          <CardDescription className='flex items-center text-xs text-muted-foreground'>
            <CalendarIcon className='mr-1 h-3 w-3' />
            {new Date(post.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </CardDescription>
        </div>
        {post.categories?.length > 0 && (
          <div className='space-y-1'>
            <span className='block text-xs font-semibold text-muted-foreground'>
              Categories:
            </span>
            <div className='flex flex-wrap gap-2'>
              {post.categories
                .filter(Boolean)
                .slice(0, 2)
                .map((cat) => {
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
              {post.categories.length > 2 && (
                <Link
                  href={`/blog/${post.slug}`}
                  className='text-muted-foreground text-sm'
                >
                  &hellip;
                </Link>
              )}
            </div>
          </div>
        )}
        {post.tags?.length > 0 && (
          <div className='space-y-1 mt-2'>
            <span className='block text-xs font-semibold text-muted-foreground'>
              Tags:
            </span>
            <div className='flex flex-wrap gap-2'>
              {post.tags
                .filter(Boolean)
                .slice(0, 2)
                .map((tag) => {
                  const key = typeof tag === 'object' ? tag.id : tag;
                  const label =
                    typeof tag === 'object' ? tag.name : tag;
                  const slug =
                    typeof tag === 'object' ? tag.slug : slugify(tag);

                  return (
                    <Badge key={key} variant='secondary'>
                      <Link href={`/blog/tag/${slug}`}>{label}</Link>
                    </Badge>
                  );
                })}
              {post.tags.length > 2 && (
                <Link
                  href={`/blog/${post.slug}`}
                  className='text-muted-foreground text-sm'
                >
                  &hellip;
                </Link>
              )}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className='text-sm text-primary line-clamp-3 min-h-[60px]'>
          {post.summary}
        </p>
      </CardContent>
      <CardFooter className='pb-6'>
        <Button asChild variant='ghost' size='sm' className='w-full'>
          <Link href={`/blog/${post.slug}`}>Read more</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
