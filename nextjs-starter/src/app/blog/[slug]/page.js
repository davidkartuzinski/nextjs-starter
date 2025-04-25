import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getAllPosts, getCategories } from '@/lib/supabase/blog';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Your Blog Name`,
    description: post.summary,
  };
}

async function getPostBySlug(slug) {
  const postsDir = path.join(process.cwd(), 'posts', slug);

  const fullPath = path.join(postsDir, 'page.mdx');

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ No page.mdx found for slug: ${slug}`);
    return null;
  }

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    content,
    ...data,
  };
}

// Custom MDX components for the blog post
const components = {
  // Override the default img component to use Next.js Image when possible
  img: ({ src, alt, ...props }) => {
    // If the src is a relative path, it's a local image in the post's directory
    if (src.startsWith('./')) {
      // Convert to absolute path for the current post
      const absoluteSrc = `/blog/(posts)/${slug}/${src.substring(2)}`;
      return (
        <Image
          src={absoluteSrc}
          alt={alt || ''}
          width={800}
          height={500}
          className='rounded-md my-6'
          {...props}
        />
      );
    }

    // For external or absolute URLs, use regular img tag
    return (
      <img
        src={src}
        alt={alt || ''}
        className='rounded-md my-6 max-w-full h-auto'
        {...props}
      />
    );
  },
};

export default async function BlogPostPage(props) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  const allPosts = await getAllPosts();
  const categories = await getCategories();

  // Check if the post has a hero image
  const heroImagePath = `/blog/${params.slug}/hero-image.jpg`;
  const publicHeroPath = path.join(
    process.cwd(),
    'public',
    'blog',
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
                  alt={post.title}
                  width={1200}
                  height={630}
                  className='rounded-lg w-full h-auto'
                  priority
                />
              </div>
            )}

            <h1 className='mb-2'>{post.title}</h1>

            <div className='flex flex-wrap items-center gap-2 mb-8 text-sm text-muted-foreground'>
              <div className='flex items-center'>
                <CalendarIcon className='mr-1 h-4 w-4' />
                {new Date(post.publishedAt).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </div>

              {post.categories && post.categories.length > 0 && (
                <div className='flex flex-wrap gap-1 ml-4'>
                  {post.categories.map((category) => (
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

            {/* Pass the slug to the components for image path resolution */}
            <MDXRemote
              source={post.content}
              components={{
                ...components,
                img: (props) =>
                  components.img({ ...props, slug: params.slug }),
              }}
            />
          </article>
        </div>

        <div className='col-span-1'>
          <Sidebar
            recentPosts={allPosts.slice(0, 5).map((post) => ({
              slug: post.slug,
              title: post.title,
              date: new Date(post.publishedAt).toLocaleDateString(
                'en-US',
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
