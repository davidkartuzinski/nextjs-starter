// src/components/home/RecentPostsSection.js

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const posts = [
  {
    title: 'How to Start with Next.js',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    href: '/blog/how-to-start',
  },
  {
    title: 'Why Tailwind CSS is Awesome',
    excerpt:
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    href: '/blog/tailwind-awesome',
  },
  {
    title: 'Tips for Building Faster Websites',
    excerpt:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    href: '/blog/faster-websites',
  },
];

export default function RecentPostsSection() {
  return (
    <section className='py-20'>
      <div className='container space-y-12'>
        <h2 className='text-3xl font-bold text-center'>
          Recent Posts
        </h2>
        <div className='grid gap-8 md:grid-cols-3'>
          {posts.map((post, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent className='text-muted-foreground space-y-4'>
                <p>{post.excerpt}</p>
                <Link
                  href={post.href}
                  className='text-primary hover:underline'
                >
                  Read more →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
