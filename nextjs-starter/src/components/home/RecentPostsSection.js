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
            const heroImage = `/images/posts/${post.slug}/hero-image.jpg`;
            const textColor = backgroundImage
              ? 'text-white'
              : 'text-muted-foreground';
            const titleColor = backgroundImage
              ? 'text-white'
              : 'text-primary';

            return (
              <Card
                key={post.id}
                className={`flex flex-col justify-between h-full overflow-hidden pt-4 pb-4 transition-all ${
                  backgroundImage
                    ? 'relative bg-cover bg-center shadow-lg hover:shadow-2xl before:absolute before:inset-0 before:bg-black/50 before:z-0'
                    : 'shadow-sm hover:shadow-md'
                }`}
                style={
                  backgroundImage
                    ? { backgroundImage: `url(${heroImage})` }
                    : {}
                }
              >
                <div
                  className={`${
                    backgroundImage
                      ? 'bg-black/60 backdrop-blur-sm p-6 h-full flex flex-col justify-between'
                      : ''
                  }`}
                >
                  <CardHeader
                    className={backgroundImage ? 'p-0 pb-4' : ''}
                  >
                    <CardTitle className={`${titleColor}`}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className={`hover:underline ${
                          backgroundImage
                            ? 'text-white hover:text-white'
                            : ''
                        }`}
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>

                  <CardContent
                    className={`flex flex-col flex-1 space-y-4 z-10 relative ${
                      backgroundImage ? 'p-0' : ''
                    }`}
                  >
                    <p
                      className={`text-sm line-clamp-3 min-h-[60px] ${textColor}`}
                    >
                      {post.summary}
                    </p>

                    <p className={`text-xs ${textColor}`}>
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
                        className={`text-sm font-medium hover:underline ${
                          backgroundImage
                            ? 'text-white hover:text-white'
                            : textColor
                        }`}
                      >
                        Read more →
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
