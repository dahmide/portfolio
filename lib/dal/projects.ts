import type { Project } from "../dto/projects";

const projects: Project[] = [
    {
        slug: "lowfi",
        title: "Lowfi",
        year: "2026",
        summary: "",
        context:
            "A minimal lo-fi radio with live stations, static and animated scenes, and ambient sounds, made for studying, working or winding down.",
        tags: ["Next.js", "TypeScript", "Azuracast"],
        liveUrl: "#",
        codeUrl: "#",
        order: 1,
    },
    {
        slug: "ajora",
        title: "Ajora",
        year: "2026",
        summary: "",
        context:
            "A contribution tracker for Ajo/Esusu savings circles. Each member gets their own account number, so payments are matched automatically.",
        tags: ["Next.js", "TypeScript", "Nomba API"],
        liveUrl: "#",
        codeUrl: "#",
        order: 2,
    },
    {
        slug: "",
        title: "",
        year: "2026",
        context: "",
        summary: "",
        tags: ["", "", "", ""],
        liveUrl: "#",
        codeUrl: "#",
        order: 3,
    },
];

export function getAllProjects(): Project[] {
    return [...projects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
    return projects.map((p) => p.slug);
}
