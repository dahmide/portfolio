"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "./Container";
import styles from "./Header.module.css";

const nav = [
    { href: "/projects", label: "Projects" },
    { href: "/writings", label: "Writings" },
    { href: "/#contact", label: "Contact" },
];

export function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <header className={styles.header}>
            <Container></Container>
        </header>
    );
}
