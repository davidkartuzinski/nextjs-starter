import Link from 'next/link';
import {
  getCategories,
  getPostsByCategory,
} from '@/lib/supabase/blog';

export const metadata = {
  title: 'All Categories | Your Blog Name',
  description: 'Browse all categories and their blog posts.',
};

export default async function CategoriesSummaryPage() {
  const categories = await getCategories();

  // Fetch all posts per category in parallel
  const categoriesWithPosts = await Promise.all(
    categories.map(async (category) => {
      const posts = await getPostsByCategory(category.slug);
      return { ...category, posts };
    })
  );

  return (
    <div className='container py-8'>
      <h1 className='text-3xl font-bold tracking-tight mb-6'>
        All Categories
      </h1>

      <div className='space-y-10'>
        {categoriesWithPosts.map((category) => (
          <div key={category.id} className='space-y-4'>
            <h2 className='text-2xl font-semibold'>
              {category.name}
            </h2>

            {category.posts.length > 0 ? (
              <ul className='space-y-2'>
                {category.posts.map((post) => (
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
                No posts in this category.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
