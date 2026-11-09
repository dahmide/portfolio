import Link from "next/link";
import styles from "./WritingCard.module.css";
import { Writing } from "@/lib/dto/writings";
import { formatDate } from "@/utils/functions";

export function WritingCard(writing: Writing) {
    return (
        <Link className={styles.writing} href={`writings/${writing.slug}`}>
            <div className={styles.writingInfo}>
                <h3>{writing.title}</h3>
                <span>{formatDate(writing.date, "MMM dd")}</span>
            </div>
            <p>{writing.description}</p>
        </Link>
    );
}
