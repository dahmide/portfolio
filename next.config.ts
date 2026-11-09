import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const nextConfig: NextConfig = {
    /* config options here */
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    // cacheComponents: true,
    // partialPrefetching: true,
    reactStrictMode: true,
};

const withMDX = createMDX({
    options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            [
                rehypeSlug,
                rehypePrettyCode,
                {
                    theme: "github-light", // or "github-dark", "min-light", etc.
                    keepBackground: true,
                },
            ],
        ],
    },
});

export default withMDX(nextConfig);
