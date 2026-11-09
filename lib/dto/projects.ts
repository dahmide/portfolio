export type Project = {
    slug: string;
    title: string;
    year: string;
    summary: string;
    tags: string[];
    liveUrl?: string;
    codeUrl?: string;
    image?: string;
    context: string;
    order?: number;
};
