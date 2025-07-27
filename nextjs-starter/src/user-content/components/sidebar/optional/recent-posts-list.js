'use client';

import Link from 'next/link';

export default function RecentPostsList({
  posts = [],
  locale = 'en',
  className = '',
  showDates = true,
  maxPosts = 5,
}) {
  const displayPosts = posts.slice(0, maxPosts);

  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <ul className={`space-y-3 ${className}`}>
      {displayPosts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/${locale}/blog/${post.slug}`}
            className='text-sm font-medium hover:underline'
          >
            {post.title}
          </Link>
          {showDates && (
            <p className='text-xs text-muted-foreground'>
              {post.date}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
