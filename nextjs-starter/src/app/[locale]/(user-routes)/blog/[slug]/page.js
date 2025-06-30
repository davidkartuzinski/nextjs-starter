import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCategories } from '@/cms-core/lib/supabase/blog.client';
import { getAllPosts } from '@/cms-core/lib/supabase/blog.server';
import Sidebar from '@/cms-core/components/layout/Sidebar';
import { Badge } from '@/cms-core/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import { useMDXComponents } from '@/cms-core/components/mdx-components';
import { compileMDX } from 'next-mdx-remote/rsc';
import { locales } from '@/cms-core/lib/i18n/config';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const params = [];

  // Generate params for each post and each locale
  for (const post of posts) {
    for (const locale of locales) {
      params.push({
        slug: post.slug,
        locale: locale,
      });
    }
  }

  return params;
}

export async function generateMetadata(props) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug, params.locale);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.frontmatter.title} | Your Blog Name`,
    description: post.summary,
  };
}

async function getPostBySlug(slug, locale) {
  // 1. Build the absolute path to the locale-specific MDX file
  const postsDir = path.join(process.cwd(), 'posts', slug, locale);
  const fullPath = path.join(postsDir, 'page.mdx');

  // 2. Check if the locale-specific file exists
  if (!fs.existsSync(fullPath)) {
    console.warn(
      `⚠️ No page.mdx found for slug: ${slug}, locale: ${locale}`
    );

    // Fallback to English if locale-specific file doesn't exist
    if (locale !== 'en') {
      console.log(`🔄 Falling back to English for slug: ${slug}`);
      return getPostBySlug(slug, 'en');
    }

    return null;
  }

  // 3. Read the file
  const raw = fs.readFileSync(fullPath, 'utf8');

  // 4. Compile the MDX content
  const { content, frontmatter } = await compileMDX({
    source: raw,
    components: useMDXComponents,
    options: {
      parseFrontmatter: true,
    },
  });

  return {
    slug,
    content,
    frontmatter,
    locale,
  };
}

export default async function BlogPostPage(props) {
  const params = await props.params;
  const { locale } = params;

  if (!locales.includes(locale)) notFound();

  const post = await getPostBySlug(params.slug, locale);
  if (!post) return notFound();

  if (!post?.frontmatter?.title) {
    console.warn('⚠️ Post is missing title in frontmatter:', post);
    return notFound();
  }

  const allPosts = await getAllPosts();
  const categories = await getCategories();

  const heroImagePath = `/user-content/images/posts/${params.slug}/hero-image.jpg`;
  const publicHeroPath = path.join(
    process.cwd(),
    'public',
    'user-content',
    'images',
    'posts',
    params.slug,
    'hero-image.jpg'
  );
  const heroImageExists = fs.existsSync(publicHeroPath);

  return (
    <div className='container py-8'>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4'>
        <div className='col-span-1 md:col-span-2 lg:col-span-3'>
          <article className='prose prose-slate dark:prose-invert max-w-none'>
            {heroImageExists && (
              <div className='not-prose mb-8'>
                <Image
                  src={heroImagePath}
                  alt={post.frontmatter.title}
                  width={1200}
                  height={630}
                  className=' w-full h-auto'
                />
              </div>
            )}

            <h1 className='mb-2'>{post.frontmatter.title}</h1>

            <div className='flex flex-wrap items-center gap-2 mb-8 text-sm text-muted-foreground'>
              <div className='flex items-center'>
                <CalendarIcon className='mr-1 h-4 w-4' />
                {new Date(
                  post.frontmatter.published_at
                ).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>

              {post.frontmatter.categories?.length > 0 && (
                <div className='flex flex-wrap gap-1 ml-4'>
                  {post.frontmatter.categories.map((category) => (
                    <Badge
                      key={category}
                      variant='secondary'
                      className='text-xs'
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {post.content}
          </article>
        </div>

        <div className='col-span-1'>
          <Sidebar
            recentPosts={allPosts.slice(0, 5).map((post) => ({
              slug: post.slug,
              title: post.title,
              date: new Date(post.published_at).toLocaleDateString(
                locale,
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              ),
            }))}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}
