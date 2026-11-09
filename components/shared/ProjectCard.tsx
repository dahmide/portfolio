import Link from "next/link";
import styles from "./ProjectCard.module.css";
import { Project } from "@/lib/dto/projects";
import { LuSquareArrowOutUpRight as External } from "react-icons/lu";
import { SiGithub } from "react-icons/si";

export function ProjectCard(project: Project) {
    return (
        <div className={styles.project}>
            <div className={styles.projectInfo}>
                <h3>
                    <Link href={`projects/${project.slug}`}>
                        {project.title}
                    </Link>
                </h3>
                <p>{project.context}</p>
                <div className={styles.projectMeta}>
                    {project.tags.map((tag, i) => (
                        <span key={i}>{tag}</span>
                    ))}
                </div>
            </div>
            <div className={styles.projectYear}>
                <a className={styles.projectLink} href={project.liveUrl}>
                    <External />
                </a>
                <a className={styles.projectLink} href={project.codeUrl}>
                    <SiGithub />
                </a>
            </div>
        </div>
    );
}
