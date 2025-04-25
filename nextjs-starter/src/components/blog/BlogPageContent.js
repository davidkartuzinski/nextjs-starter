'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllPosts, getCategories } from '@/lib/supabase/blog';
import BlogPostCard from '@/components/blog/BlogPostCard';
import Sidebar from '@/components/layout/Sidebar';
import Pagination from '@/components/blog/Pagination';

const POSTS_PER_PAGE = 6;

export default function BlogPageContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      const allPosts = await getAllPosts();
      const allCategories = await getCategories();
      setPosts(allPosts);
      setCategories(allCategories);
    })();
  }, []);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPagePosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  return (
    <div className='container py-8'>
      <div className='flex flex-col gap-4 md:gap-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Blog</h1>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4'>
          <div className='col-span-1 md:col-span-2 lg:col-span-3'>
            {currentPagePosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
            {totalPages > 1 && (
              <div className='mt-8'>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath='/blog'
                />
              </div>
            )}
          </div>

          <div className='col-span-1'>
            <Sidebar
              recentPosts={posts.slice(0, 5).map((post) => ({
                slug: post.slug,
                title: post.title,
                date: new Date(post.publishedAt).toLocaleDateString(),
              }))}
              categories={categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
