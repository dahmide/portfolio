import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Map markdown elements to your article styles via global CSS
        // Override per-element here when needed (e.g. custom code blocks)
        ...components,
    };
}
