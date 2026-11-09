import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/dal/projects";
import styles from "./page.module.css";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Section } from "@/components/blocks/Section";

export const metadata: Metadata = {
    title: "Projects",
    description: "Selected product work, systems, and open-source tools.",
};

export default function ProjectsPage() {
    const projects = getAllProjects();
    return (
        <div>
            <Container>
                <h2>Projects</h2>
                <p>
                    Selected product work, systems, and open-source tools. A mix
                    of shipped features and experiments.
                </p>
                <div>
                    <Section>
                        <ul>
                            {projects.map((project) => (
                                <li key={project.slug}>
                                    <ProjectCard {...project} />
                                </li>
                            ))}
                        </ul>
                    </Section>
                </div>
            </Container>
        </div>
    );
}
