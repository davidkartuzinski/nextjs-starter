/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  // experimental: {
  //   mdxRs: true, // optional, but helps if you're experimenting
  //   serverActions: true, // optional for full RSC
  // },
  transpilePackages: ['next-mdx-remote'],

  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx'],
  // Optionally, add any other Next.js config below
};

export default nextConfig;
