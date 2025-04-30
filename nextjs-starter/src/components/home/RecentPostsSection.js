import Link from 'next/link';
import { getRecentPosts } from '@/lib/supabase/blog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function RecentPostsSection() {
  const posts = await getRecentPosts();

  return (
    <section className='w-full'>
      <div className='container mx-auto px-4 flex flex-col items-center justify-center text-left space-y-6 py-20 max-w-6xl'>
        <h2 className='text-3xl font-bold text-center'>
          Read Recent Posts
        </h2>
        <div className='grid gap-8 md:grid-cols-3'>
          {posts.map((post) => (
            <Card
              key={post.id}
              className='flex flex-col justify-between h-full'
            >
              <CardHeader>
                <CardTitle>
                  <Link
                    href={`/blog/${post.slug}`}
                    className='hover:underline'
                  >
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent className='flex flex-col justify-between flex-1 space-y-4 text-muted-foreground'>
                <p className='text-sm text-primary line-clamp-3 min-h-[60px]'>
                  {post.summary}
                </p>

                <p className='text-xs'>
                  {new Date(post.published_at).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </p>

                <div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className='text-primary text-sm hover:underline'
                  >
                    Read more →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
