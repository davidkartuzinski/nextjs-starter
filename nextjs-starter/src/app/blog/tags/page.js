import Link from 'next/link';
import { getTags, getPostsByTag } from '@/lib/supabase/blog';

export const metadata = {
  title: 'All Tags | Your Blog Name',
  description: 'Browse all tags and their blog posts.',
};

export default async function TagsSummaryPage() {
  const tags = await getTags();

  // Fetch posts for all tags in parallel
  const tagsWithPosts = await Promise.all(
    tags.map(async (tag) => {
      const posts = await getPostsByTag(tag.slug);
      return { ...tag, posts };
    })
  );

  return (
    <div className='container py-8'>
      <h1 className='text-3xl font-bold tracking-tight mb-6'>
        All Tags
      </h1>

      <div className='space-y-10'>
        {tagsWithPosts.map((tag) => (
          <div key={tag.id} className='space-y-4'>
            <h2 className='text-2xl font-semibold'>{tag.name}</h2>

            {tag.posts.length > 0 ? (
              <ul className='space-y-2'>
                {tag.posts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className='text-lg font-medium text-blue-600 hover:underline'
                    >
                      {post.title}
                    </Link>
                    <span className='text-muted-foreground text-sm ml-2'>
                      —{' '}
                      {new Date(
                        post.published_at
                      ).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-muted-foreground text-sm'>
                No posts with this tag.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
