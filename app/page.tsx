import Link from "next/link";
import { getAllProjects } from "@/lib/dal/projects";
import { getAllWritings } from "@/lib/dal/writings";
import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import styles from "./page.module.css";
import { Section } from "@/components/blocks/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { WritingCard } from "@/components/shared/WritingCard";
import { About } from "@/components/blocks/About";
import { getPlaybackState } from "@/lib/spotify";
import { Button } from "@/components/ui/Button";

type TimeZone = {
    id: string;
    abbreviation?: string;
};

const getInitialTime = (timezone: TimeZone, hour12: boolean) => {
    const { id, abbreviation } = timezone;
    const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: id,
        hour: "numeric",
        minute: "2-digit",
        hour12,
        // Only ask Intl for the zone name when no custom abbreviation is given
        ...(abbreviation ? {} : { timeZoneName: "short" as const }),
    }).format(new Date());
    return abbreviation ? `${formatted} ${abbreviation}` : formatted;
};

export default async function Page() {
    const np = await getPlaybackState();
    const timeZone = getInitialTime(site.timezone, true);
    const projects = getAllProjects().slice(0, 2);
    const writings = getAllWritings().slice(0, 2);
    return (
        <div className="">
            <Section>
                <Container>
                    <div className={styles.intro}>
                        <Eyebrow>Frontend Engineer</Eyebrow>
                        <h1>Hey! I'm Ayomide</h1>
                        <p>
                            I design and build web interfaces that feel
                            inevitable.
                        </p>
                    </div>
                    <About initialTime={timeZone} initialData={np} />
                </Container>
            </Section>
            <Section>
                <Container>
                    <div className={styles.projectHead}>
                        <h2>Latest Projects</h2>
                        <Link href="/projects">All projects</Link>
                    </div>
                    <div className={styles.projectList}>
                        {projects.map((project) => (
                            <ProjectCard key={project.slug} {...project} />
                        ))}
                    </div>
                </Container>
            </Section>
            <Section>
                <Container>
                    <div className={styles.writingHead}>
                        <h2>Latest Writings</h2>
                        <Link href="/writings">All writings</Link>
                    </div>
                    <div className={styles.writingList}>
                        {writings.map((writing) => (
                            <WritingCard key={writing.slug} {...writing} />
                        ))}
                    </div>
                </Container>
            </Section>
            <Section>
                <Container>
                    <div className={styles.contactHead}>
                        <h2>Let's talk</h2>
                        <p>
                            Got something in mind? I'd love to hear about it.
                            Whether it's a project, an opportunity, or just a
                            quick hello, feel free to get in touch.
                        </p>
                    </div>
                    <div className={styles.contactList}>
                        <Button
                            variant="link"
                            href={`mailto:${site.email}`}
                            external
                        >
                            {site.email}
                        </Button>
                        <Button
                            variant="link"
                            href={site.social.github}
                            external
                        >
                            GitHub
                        </Button>
                        <Button
                            variant="link"
                            href={site.social.linkedin}
                            external
                        >
                            LinkedIn
                        </Button>
                        <Button variant="link" href={site.social.x} external>
                            X (Twitter)
                        </Button>
                    </div>
                </Container>
            </Section>
        </div>
    );
}
