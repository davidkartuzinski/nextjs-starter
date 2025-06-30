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
  const [tagUrls, setTagUrls] = useState({});
  const [tagNames, setTagNames] = useState({});

  useEffect(() => {
    async function loadUrls() {
      try {
        const { getCategoryUrl } = await import(
          '@/cms-core/lib/i18n/category-utils'
        );
        const { getTagUrl, getTagInfo, getAllTags } = await import(
          '@/cms-core/lib/i18n/tag-utils'
        );

        const categoryUrls = {};
        const tagUrls = {};
        const tagNames = {};

        if (post.categories) {
          for (const category of post.categories) {
            categoryUrls[category] = await getCategoryUrl(
              category,
              locale
            );
          }
        }

        if (post.tags) {
          for (const tag of post.tags) {
            // First try to find the corresponding slug for this tag name
            const translatedTags = await getAllTags(locale);

            const matchingTag = translatedTags.find(
              (t) =>
                t.name === tag ||
                t.name.toLowerCase() === tag.toLowerCase() ||
                t.slug ===
                  tag
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
            );

            const tagSlug = matchingTag ? matchingTag.slug : tag;
            tagUrls[tag] = await getTagUrl(tagSlug, locale);
            const tagInfo = await getTagInfo(tagSlug, locale);
            tagNames[tag] = tagInfo?.name || tag;
          }
        }

        setCategoryUrls(categoryUrls);
        setTagUrls(tagUrls);
        setTagNames(tagNames);
      } catch (error) {
        console.error('Error loading URLs:', error);
        // Fallback to simple URLs
        const fallbackCategoryUrls = {};
        const fallbackTagUrls = {};
        const fallbackTagNames = {};

        if (post.categories) {
          post.categories.forEach((category) => {
            fallbackCategoryUrls[
              category
            ] = `/${locale}/blog/category/${category}`;
          });
        }

        if (post.tags) {
          post.tags.forEach((tag) => {
            // Try to find the corresponding slug for this tag name
            const fallbackSlug = tag
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-');
            fallbackTagUrls[
              tag
            ] = `/${locale}/blog/tag/${fallbackSlug}`;
            fallbackTagNames[tag] = tag;
          });
        }

        setCategoryUrls(fallbackCategoryUrls);
        setTagUrls(fallbackTagUrls);
        setTagNames(fallbackTagNames);
      }
    }

    loadUrls();
  }, [post.categories, post.tags, locale]);

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
                  const label = tagNames[tag] || tag;
                  const slug =
                    typeof tag === 'object' ? tag.slug : slugify(tag);

                  return (
                    <Badge key={key} variant='secondary'>
                      <Link
                        href={
                          tagUrls[tag] ||
                          `/${locale}/blog/tag/${slug}`
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
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
