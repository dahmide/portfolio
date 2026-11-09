import type { Metadata } from "next";
import Link from "next/link";
import { getAllWritings } from "@/lib/dal/writings";
import styles from "./page.module.css";
import { Container } from "@/components/layout/Container";
import { Writing } from "@/lib/dto/writings";
import { Section } from "@/components/blocks/Section";
import { WritingCard } from "@/components/shared/WritingCard";

type GroupedWritings = Record<number, Writing[]>;

const groupPostsByYear = (posts: Writing[]) => {
    return posts.reduce<GroupedWritings>((groups, post) => {
        const year = new Date(post.date).getFullYear();
        if (!groups[year]) {
            groups[year] = [];
        }
        groups[year].push(post);
        return groups;
    }, {});
};

const orderPostsByYear = (posts: GroupedWritings) => {
    return Object.entries(posts).sort(
        ([yearA], [yearB]) => Number(yearB) - Number(yearA)
    );
};

export const metadata: Metadata = {
    title: "Writings",
    description:
        "Notes on UI systems, interaction, CSS, and the practical side of building frontends.",
};

export default function WritingsPage() {
    const writings = getAllWritings();
    const groupedWritings = groupPostsByYear(writings);
    const orderedWritings = orderPostsByYear(groupedWritings);
    return (
        <div>
            <Container>
                <h2>Writings</h2>
                <p>
                    Notes on UI systems, interaction, CSS, and the practical
                    side of building frontends.
                </p>
                <div>
                    {orderedWritings.map(([year, writings]) => (
                        <Section key={year} aria-labelledby={`year-${year}`}>
                            <h2 id={`year-${year}`}>
                                {year} <span>({writings.length})</span>
                            </h2>
                            <ul>
                                {writings.map((writing) => (
                                    <li key={writing.slug}>
                                        <WritingCard {...writing} />
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    ))}
                </div>
            </Container>
        </div>
    );
}
