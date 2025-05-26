import fs from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { locales, defaultLocale } from '@/cms-core/lib/i18n/config';
import { staticPageRoutes } from '@/cms-core/lib/i18n/routes';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = Object.keys(staticPageRoutes);
  const params = [];

  for (const locale of locales) {
    for (const slug of slugs) {
      const localizedSlug = staticPageRoutes[slug][locale];
      params.push({ locale, slug: localizedSlug });
    }
  }

  return params;
}

export default async function StaticPage({ params }) {
  const { locale, slug } = await Promise.resolve(params);

  const matchedEntry = Object.entries(staticPageRoutes).find(
    ([, slugs]) => slugs[locale] === slug
  );

  if (!matchedEntry) notFound();

  const routeKey = matchedEntry[0];

  const basePath = path.join(
    process.cwd(),
    'src/user-content/content'
  );
  const localizedPath = path.join(
    basePath,
    locale,
    'pages',
    `${routeKey}.mdx`
  );
  const fallbackPath = path.join(
    basePath,
    defaultLocale,
    'pages',
    `${routeKey}.mdx`
  );

  let mdxContent;

  try {
    mdxContent = await fs.readFile(localizedPath, 'utf8');
  } catch {
    try {
      mdxContent = await fs.readFile(fallbackPath, 'utf8');
    } catch {
      notFound();
    }
  }

  const { content } = await compileMDX({
    source: mdxContent,
    components: { Link },
  });

  return (
    <section className='container mx-auto px-4 py-16 prose dark:prose-invert'>
      {content}
    </section>
  );
}
