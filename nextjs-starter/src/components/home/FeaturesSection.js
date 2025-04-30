// src/app/page.js (or wherever your homepage is)
import { getFeaturedPosts } from '@/lib/supabase/blog';
import BlogPostCard from '@/components/blog/BlogPostCard';

export default async function HomePage() {
  const posts = await getFeaturedPosts();

  return (
    <section className='w-full'>
      <div className='container mx-auto px-4 flex flex-col items-center justify-center text-left space-y-6 py-20 max-w-6xl'>
        <h2 className='text-2xl font-bold mb-4'>Featured Posts</h2>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
