import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
    return (
        <main>
            <div className={styles.wrap}>
                <p className={styles.code} aria-hidden>
                    404
                </p>
                <h1>This page doesn’t exist</h1>
                <p>
                    The link may be broken, or the page may have moved. Try one
                    of these instead.
                </p>
                <div className={styles.actions}>
                    <Link href="/">Home</Link>
                    <Link href="/projects">Projects</Link>
                    <Link href="/writings">Writings</Link>
                    <Link href="/#contact">Contact</Link>
                </div>
            </div>
        </main>
    );
}
