import type { ComponentType } from "react";

type MdxLoader = () => Promise<{ default: ComponentType<object> }>;

/**
 * Explicit maps so the bundler can resolve each file.
 * Add a line when you add content/writings/<slug>.mdx or content/projects/<slug>.mdx
 */
const writingMdx: Record<string, MdxLoader> = {
    // "": () => import("@/content/writings/*.mdx"),
};

const projectMdx: Record<string, MdxLoader> = {
    // "": () => import("@/content/projects/*.mdx"),
};

export async function getWritingContent(
    slug: string
): Promise<ComponentType<object> | null> {
    const load = writingMdx[slug];
    if (!load) return null;
    return (await load()).default;
}

export async function getProjectContent(
    slug: string
): Promise<ComponentType<object> | null> {
    const load = projectMdx[slug];
    if (!load) return null;
    return (await load()).default;
}

export function hasWritingContent(slug: string): boolean {
    return slug in writingMdx;
}

export function hasProjectContent(slug: string): boolean {
    return slug in projectMdx;
}
