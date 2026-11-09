"use client";

import { site } from "@/config/site";
import { Container } from "./Container";
import styles from "./Footer.module.css";

export function Footer() {
    const date = new Date();
    const year = date.getFullYear();
    return (
        <footer className={styles.footer}>
            <Container></Container>
        </footer>
    );
}
