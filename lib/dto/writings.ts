export type WritingCategory =
    | "engineering"
    | "design-systems"
    | "accessibility"
    | "css"
    | "process"
    | "career";

export type Writing = {
    slug: string;
    title: string;
    date: string; // ISO YYYY-MM-DD
    category: WritingCategory;
    description: string;
    /** Path under content/writings without extension, or inline for scaffold */
    body?: string;
};

export const WRITING_CATEGORIES: {
    id: WritingCategory | "all";
    label: string;
}[] = [
    { id: "all", label: "All" },
    { id: "engineering", label: "Engineering" },
    { id: "design-systems", label: "Design systems" },
    { id: "accessibility", label: "Accessibility" },
    { id: "css", label: "CSS" },
    { id: "process", label: "Process" },
    { id: "career", label: "Career" },
];
