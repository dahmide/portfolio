import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getAllWritings,
    getWritingBySlug,
    getWritingSlugs,
} from "@/lib/dal/writings";
import { getWritingContent } from "@/lib/mdx";
import styles from "./page.module.css";
import { formatDate } from "@/utils/functions";
import { Markdown } from "@/components/shared/Markdown";
import { Container } from "@/components/layout/Container";
import { Toc } from "@/components/ui/Toc";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return getWritingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const writing = getWritingBySlug(slug);
    if (!writing) return { title: "Writing" };
    return {
        title: writing.title,
        description: writing.description,
    };
}

export default async function WritingPage({ params }: Props) {
    const { slug } = await params;
    const writing = getWritingBySlug(slug);
    if (!writing) notFound();

    const Content = await getWritingContent(slug);

    const all = getAllWritings();
    const idx = all.findIndex((w) => w.slug === slug);
    const prev = idx < all.length - 1 ? all[idx + 1] : null; // older
    const next = idx > 0 ? all[idx - 1] : null; // newer

    return (
        <div className={styles.page}>
            <Toc />
            <div className="">
                <article className={styles.article}>
                    <div className={styles.articleMeta}>
                        <span>{formatDate(writing.date)}</span>
                        <span>{writing.category}</span>
                        <span>{formatDate(writing.date)}</span>
                    </div>
                    <div className={styles.articleHero}>
                        <h1>{writing.title}</h1>
                        <p>{writing.description}</p>
                    </div>
                    <div className={styles.articleBody}>
                        {Content ? (
                            <Markdown>
                                <Content />
                            </Markdown>
                        ) : (
                            <p className={styles.articleBodyEmpty}>
                                Body not written yet. Add{" "}
                                <code>content/writings/{slug}.mdx</code> and
                                register it in <code>lib/mdx.ts</code>.
                            </p>
                        )}
                    </div>
                    <footer className={styles.articleFoot}>
                        <div className={styles.articleNav}>
                            {prev ? (
                                <Link
                                    className={styles.articlePrev}
                                    href={`/writings/${prev.slug}`}
                                >
                                    <span className="caption">Previous</span>
                                    <span className={styles.articleTitle}>
                                        {prev.title}
                                    </span>
                                </Link>
                            ) : (
                                <span />
                            )}
                            {next ? (
                                <Link
                                    className={styles.articleNext}
                                    href={`/writings/${next.slug}`}
                                >
                                    <span className="caption">Next</span>
                                    <span className={styles.articleTitle}>
                                        {next.title}
                                    </span>
                                </Link>
                            ) : (
                                <span />
                            )}
                        </div>
                    </footer>
                </article>
            </div>
        </div>
    );
}
