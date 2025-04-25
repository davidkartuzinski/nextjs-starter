'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar({
  recentPosts = [],
  categories = [],
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/blog/search?q=${encodeURIComponent(searchQuery)}`
      );
    }
  };

  return (
    <aside className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSearch}
            className='flex w-full items-center space-x-2'
          >
            <Input
              type='search'
              placeholder='Search blog...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type='submit' size='icon'>
              <Search className='h-4 w-4' />
              <span className='sr-only'>Search</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground mb-4'>
            A brief description about yourself or your blog.
          </p>
          <Button variant='outline' asChild>
            <Link href='/about'>Learn more</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPosts.length > 0 ? (
            <ul className='space-y-3'>
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className='text-sm font-medium hover:underline'
                  >
                    {post.title}
                  </Link>
                  <p className='text-xs text-muted-foreground'>
                    {post.date}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-muted-foreground'>
              No recent posts.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            {categories.map((category) => (
              <Badge key={category.slug} variant='outline' asChild>
                <Link href={`/blog/category/${category.slug}`}>
                  {category.name}
                </Link>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
