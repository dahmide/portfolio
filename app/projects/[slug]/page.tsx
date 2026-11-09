import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getAllProjects,
    getProjectBySlug,
    getProjectSlugs,
} from "@/lib/dal/projects";
import { getProjectContent } from "@/lib/mdx";
import styles from "./page.module.css";
import { Markdown } from "@/components/shared/Markdown";
import { Container } from "@/components/layout/Container";
import { Toc } from "@/components/ui/Toc";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) return { title: "Project" };
    return {
        title: project.title,
        description: project.summary,
    };
}

export const PROJECT_TOC = [
    "Problem",
    "Context",
    "My role",
    "Frontend decisions",
    "Tradeoffs",
    "Quality",
    "Result",
    "Next",
] as const;

const items = PROJECT_TOC.map((t) => ({ id: t.toLowerCase(), title: t }));

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) notFound();

    const Content = await getProjectContent(slug);

    const all = getAllProjects();
    const idx = all.findIndex((p) => p.slug === slug);
    const prev = idx > 0 ? all[idx - 1] : null;
    const next = idx < all.length - 1 ? all[idx + 1] : null;

    return (
        <div className={styles.page}>
            <Container>
                <Toc items={items} />
                <div className="">
                    <article className={styles.article}>
                        <div className={styles.articleMeta}>
                            <span>{project.year}</span>
                            <span>·</span>
                            <span>{project.year}</span>
                        </div>
                        <div className={styles.articleHero}>
                            <h1>{project.title}</h1>
                            <p>{project.summary}</p>
                        </div>
                        <div className={styles.articleInfo}>
                            <div className={styles.articleInfoRow}>
                                <div className={styles.articleInfoLabel}>
                                    Tools
                                </div>
                                <div className={styles.articleInfoTools}>
                                    {project.tags.map((t, i) => (
                                        <span key={t}>{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.articleInfoRow}>
                                <div className={styles.articleInfoLabel}>
                                    Links
                                </div>
                                <div className={styles.articleInfoLinks}>
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Live
                                        </a>
                                    )}
                                    {project.codeUrl && (
                                        <a
                                            href={project.codeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {project.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                className={styles.articleImage}
                                src={project.image}
                            />
                        ) : (
                            <div
                                className={styles.articleFrame}
                                aria-label="Project visual"
                            >
                                Project visual placeholder
                            </div>
                        )}
                        <div className={styles.articleBody}>
                            {Content ? (
                                <Markdown>
                                    <Content />
                                </Markdown>
                            ) : (
                                <p className={styles.articleBodyEmpty}>
                                    Case study not written yet. Add{" "}
                                    <code>content/projects/{slug}.mdx</code> and
                                    register it in <code>lib/mdx.ts</code>.
                                </p>
                            )}
                        </div>
                        <footer className={styles.articleFoot}>
                            <div className={styles.articleNav}>
                                {prev ? (
                                    <Link
                                        className={styles.articlePrev}
                                        href={`/projects/${prev.slug}`}
                                    >
                                        <span className="caption">
                                            Previous
                                        </span>
                                        <span>{prev.title}</span>
                                    </Link>
                                ) : (
                                    <span />
                                )}
                                {next ? (
                                    <Link
                                        className={styles.articleNext}
                                        href={`/projects/${next.slug}`}
                                    >
                                        <span className="caption">Next</span>
                                        <span>{next.title}</span>
                                    </Link>
                                ) : (
                                    <span />
                                )}
                            </div>
                        </footer>
                    </article>
                </div>
            </Container>
        </div>
    );
}
