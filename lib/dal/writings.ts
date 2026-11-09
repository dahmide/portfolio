import type { Writing, WritingCategory } from "../dto/writings";

const writings: Writing[] = [
    {
        slug: "sample",
        title: "How I approach complex UI state",
        date: "2026-09-01",
        category: "engineering",
        description:
            "Patterns for managing derived state, optimistic updates, and keeping the UI honest when the server is slow.",
    },
    {
        slug: "design-tokens-survive-redesigns",
        title: "Design tokens that survive redesigns",
        date: "2026-06-01",
        category: "design-systems",
        description:
            "How to structure tokens so a visual refresh doesn’t force a rewrite of every component.",
    },
    {
        slug: "accessible-motion",
        title: "Building accessible motion without the jank",
        date: "2026-03-01",
        category: "accessibility",
        description:
            "Respecting reduced-motion preferences while still giving intentional interfaces a sense of life.",
    },
    {
        slug: "shipping-design-system",
        title: "What I learned shipping a design system",
        date: "2025-11-01",
        category: "engineering",
        description:
            "Adoption, ownership, and the small decisions that decide whether a system gets used or ignored.",
    },
    {
        slug: "css-that-scales",
        title: "CSS that scales with your team",
        date: "2025-07-01",
        category: "css",
        description:
            "Conventions, layers, and constraints that keep stylesheets readable as the product grows.",
    },
    {
        slug: "writing-rfcs",
        title: "Writing RFCs that engineers actually read",
        date: "2025-02-01",
        category: "process",
        description:
            "Structure, length, and tone for technical proposals that move a team without the ceremony.",
    },
    {
        slug: "senior-frontend",
        title: "What “senior frontend” meant for me",
        date: "2024-10-01",
        category: "career",
        description:
            "Less about frameworks, more about judgment, communication, and knowing when not to write code.",
    },
];

export function getAllWritings(): Writing[] {
    return [...writings].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getWritingBySlug(slug: string): Writing | undefined {
    return writings.find((w) => w.slug === slug);
}

export function getWritingSlugs(): string[] {
    return writings.map((w) => w.slug);
}

export function getWritingsByCategory(
    category: WritingCategory | "all"
): Writing[] {
    const all = getAllWritings();
    if (category === "all") return all;
    return all.filter((w) => w.category === category);
}

export function formatWritingDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

export function categoryLabel(category: WritingCategory): string {
    const map: Record<WritingCategory, string> = {
        engineering: "Engineering",
        "design-systems": "Design systems",
        accessibility: "Accessibility",
        css: "CSS",
        process: "Process",
        career: "Career",
    };
    return map[category];
}
