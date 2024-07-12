import nextMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const NEXT_CONFIG = {
  // output, basePath, and images are required for GitHub Pages.
  // See https://github.com/gregrickaby/nextjs-github-pages
  output: "export",
  // TODO: 기존 저장소 대체 이후에 base path 변경
  basePath: "/blog",
  images: {
    unoptimized: true,
  },

  // Configure `pageExtensions` to include MDX files
  // See https://nextjs.org/docs/app/building-your-application/configuring/mdx#getting-started
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

/** @type {import('@next/mdx').MDXConfig} */
const MDX_CONFIG = {
  extension: /\.(md|mdx)$/,
};

const withMDX = nextMDX(MDX_CONFIG);
const nextConfig = withMDX(NEXT_CONFIG);

export default nextConfig;
