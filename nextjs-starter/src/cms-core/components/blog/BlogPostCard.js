'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/cms-core/components/ui/card';
import { Badge } from '@/cms-core/components/ui/badge';
import { Button } from '@/cms-core/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import ImageWithFallback from '@/cms-core/components/optional/ImageWithFallback';
import { useState, useEffect } from 'react';

import slugify from 'react-slugify';

export default function BlogPostCard({ post, locale = 'en' }) {
  const [categoryUrls, setCategoryUrls] = useState({});

  useEffect(() => {
    async function loadCategoryUrls() {
      try {
        const { getCategoryUrl } = await import(
          '@/cms-core/lib/i18n/category-utils'
        );
        const urls = {};

        if (post.categories) {
          for (const category of post.categories) {
            urls[category] = await getCategoryUrl(category, locale);
          }
        }

        setCategoryUrls(urls);
      } catch (error) {
        console.error('Error loading category URLs:', error);
        // Fallback to simple URLs
        const fallbackUrls = {};
        if (post.categories) {
          post.categories.forEach((category) => {
            fallbackUrls[
              category
            ] = `/${locale}/blog/category/${category}`;
          });
        }
        setCategoryUrls(fallbackUrls);
      }
    }

    loadCategoryUrls();
  }, [post.categories, locale]);

  const featuredImage = `/user-content/images/posts/${post.slug}/hero-image.jpg`;

  return (
    <Card className='flex flex-col justify-between h-full'>
      {featuredImage && (
        <div className='aspect-video w-full overflow-hidden'>
          <Link
            href={`/${locale}/blog/${post.slug}`}
            className='hover:underline'
          >
            <ImageWithFallback
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
          <div className='flex items-start justify-between gap-2'>
            <CardTitle className='flex-1'>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className='hover:underline'
              >
                {post.title}
              </Link>
            </CardTitle>
            {post.fallback && (
              <Badge variant='outline' className='text-xs shrink-0'>
                {locale === 'es'
                  ? 'EN'
                  : locale === 'fr'
                  ? 'EN'
                  : 'EN'}
              </Badge>
            )}
          </div>

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
                      <Link
                        href={
                          categoryUrls[cat] ||
                          `/${locale}/blog/category/${slug}`
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        {label || 'Unnamed'}
                      </Link>
                    </Badge>
                  );
                })}
              {post.categories.length > 2 && (
                <Link
                  href={`/${locale}/blog/${post.slug}`}
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
                      <Link href={`/${locale}/blog/tag/${slug}`}>
                        {label}
                      </Link>
                    </Badge>
                  );
                })}
              {post.tags.length > 2 && (
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className='text-muted-foreground text-sm'
                >
                  &hellip;
                </Link>
              )}
            </div>
          </div>
        )}
      </CardHeader>
      <CardFooter className='pb-6'>
        <Button asChild variant='ghost' size='sm' className='w-full'>
          <Link href={`/${locale}/blog/${post.slug}`}>Read more</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
