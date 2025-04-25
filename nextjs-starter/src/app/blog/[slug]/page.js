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
import { mdxComponents } from '@/components/mdx-components'; // ✅
import { compileMDX } from 'next-mdx-remote/rsc'; // ✅ Required to safely compile MDX in App Router

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params; // ✅ safely unwrap first
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.frontmatter.title} | Your Blog Name`,
    description: post.summary,
  };
}

async function getPostBySlug(slug) {
  // 1. Build the absolute path to the MDX file for the blog post
  const postsDir = path.join(process.cwd(), 'posts', slug);
  const fullPath = path.join(postsDir, 'page.mdx');

  // 2. Check if the file exists
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ No page.mdx found for slug: ${slug}`);
    return null;
  }

  // 3. Read the file
  const raw = fs.readFileSync(fullPath, 'utf8');

  // 4. Compile the MDX content using compileMDX() from next-mdx-remote
  //    - This compiles the MDX string to a renderable React element
  //    - It also parses the frontmatter (--- title: ... ---)

  const { content, frontmatter } = await compileMDX({
    source: raw,
    components: mdxComponents, // ✅ you must pass custom components here
    options: {
      parseFrontmatter: true,
    },
  });

  // 5. Return the compiled content and frontmatter
  //    - The content is now a renderable React element
  //    - The frontmatter is now a JavaScript object
  //    - This is ready to be passed to MDXRemote

  return {
    slug,
    content,
    frontmatter,
  };
}

export default async function BlogPostPage(props) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();
  console.log('🧪 post:', post);

  if (!post?.frontmatter?.title) {
    console.warn('⚠️ Post is missing title in frontmatter:', post);
    return notFound();
  }

  const allPosts = await getAllPosts();
  const categories = await getCategories();

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
                  alt={post.frontmatter.title}
                  width={1200}
                  height={630}
                  className='rounded-lg w-full h-auto'
                  priority
                />
              </div>
            )}

            <h1 className='mb-2'>{post.frontmatter.title}</h1>

            <div className='flex flex-wrap items-center gap-2 mb-8 text-sm text-muted-foreground'>
              <div className='flex items-center'>
                <CalendarIcon className='mr-1 h-4 w-4' />
                {new Date(
                  post.frontmatter.publishedAt
                ).toLocaleDateString('en-US', {
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
