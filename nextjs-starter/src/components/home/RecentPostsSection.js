import Link from 'next/link';
import { getRecentPosts } from '@/lib/supabase/blog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function RecentPostsSection({
  backgroundImage = false,
}) {
  const posts = await getRecentPosts();

  return (
    <section className='w-full'>
      <div className='container mx-auto px-4 flex flex-col items-center justify-center text-left space-y-6 py-20 max-w-6xl'>
        <h2 className='text-3xl font-bold text-center'>
          Read Recent Posts
        </h2>

        <div className='grid gap-8 md:grid-cols-3'>
          {posts.map((post) => {
            const cardContent = (
              <Card
                key={post.id}
                className={`relative flex flex-col justify-between h-full overflow-hidden pt-4 pb-4 transition-shadow hover:shadow-2xl ${
                  backgroundImage ? 'text-white' : ''
                }`}
              >
                {backgroundImage && (
                  <>
                    {/* Background Image */}
                    <div
                      className='absolute inset-0 bg-cover bg-center z-0'
                      style={{
                        backgroundImage: `url('/images/posts/${post.slug}/hero-image.jpg')`,
                      }}
                    />
                    {/* Overlay */}
                    <div className='absolute inset-0 bg-black/60 z-10' />
                  </>
                )}

                {/* Content */}
                <div className='relative z-20 px-6'>
                  <CardHeader>
                    <CardTitle className='hover:underline'>
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className='flex flex-col justify-between flex-1 space-y-4'>
                    <p className='text-sm line-clamp-3 min-h-[60px]'>
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

                    <span className='text-sm font-medium hover:underline'>
                      Read more →
                    </span>
                  </CardContent>
                </div>
              </Card>
            );

            return backgroundImage ? (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className='block h-full w-full'
              >
                {cardContent}
              </Link>
            ) : (
              cardContent
            );
          })}
        </div>
      </div>
    </section>
  );
}
