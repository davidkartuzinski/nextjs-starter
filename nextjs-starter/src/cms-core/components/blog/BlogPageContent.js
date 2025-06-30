'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BlogPostCard from '@/cms-core/components/blog/BlogPostCard';
import Sidebar from '@/cms-core/components/layout/Sidebar';
import Pagination from '@/cms-core/components/blog/Pagination';

const POSTS_PER_PAGE = 6;

export default function BlogPageContent({
  posts = [],
  categories = [],
  locale = 'en',
}) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

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
              <BlogPostCard
                key={post.slug}
                post={post}
                locale={locale}
              />
            ))}
            {totalPages > 1 && (
              <div className='mt-8'>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath={`/${locale}/blog`}
                />
              </div>
            )}
          </div>

          <div className='col-span-1'>
            <Sidebar
              recentPosts={posts.slice(0, 5).map((post) => ({
                slug: post.slug,
                title: post.title,
                date: new Date(
                  post.published_at
                ).toLocaleDateString(),
              }))}
              categories={categories}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
