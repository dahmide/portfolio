"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/Collapsible";
import { Progress } from "@/components/ui/Progress";
import styles from "./Toc.module.css";

export type TocItem = {
    id: string;
    title: string;
    level?: 0 | 1;
};

type TocProps = {
    items: TocItem[];
    heading?: string;
    /** Distance from the top of the viewport (px) at which a section becomes active. */
    offset?: number;
    className?: string;
};

export function Toc({
    items,
    heading = "On this page",
    offset = 100,
    className,
}: TocProps) {
    const [open, setOpen] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    // Stable dependency, so inline arrays don't re-trigger the effect every render.
    const key = items.map((item) => item.id).join(",");

    useEffect(() => {
        if (!key) return;

        // Items must be in the same order as the headings appear on the page.
        const elements = key
            .split(",")
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        const update = () => {
            // Rounded to a whole percent, so state only changes (and re-renders)
            // when the visible value changes, not on every scroll event.
            const scrollable =
                document.documentElement.scrollHeight - window.innerHeight;
            const ratio =
                scrollable > 0
                    ? Math.min(Math.max(window.scrollY / scrollable, 0), 1)
                    : 0;
            setProgress(Math.round(ratio * 100));

            if (elements.length === 0) return;

            const atBottom =
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 2;

            if (atBottom) {
                setActiveId(elements[elements.length - 1].id);
                return;
            }

            // Stays null until the first section is reached.
            let current: string | null = null;
            for (const el of elements) {
                if (el.getBoundingClientRect().top - offset > 0) break;
                current = el.id;
            }
            setActiveId(current);
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);

        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [key, offset]);

    if (items.length === 0) return null;

    const activeItem = items.find((item) => item.id === activeId);
    const triggerLabel = activeItem?.title ?? heading;

    const links = items.map(({ id, title, level = 0 }) => {
        const isActive = id === activeId;
        return (
            <a
                key={id}
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => {
                    setActiveId(id);
                    setOpen(false);
                }}
                className={cn(
                    styles.link,
                    level === 0 ? styles.top : styles.nested,
                    isActive && styles.active
                )}
            >
                {title}
            </a>
        );
    });

    return (
        <aside className={cn(styles.aside, className)}>
            {/* Mobile: collapsible, collapsed by default */}
            <Collapsible
                open={open}
                onOpenChange={(value) => setOpen(value)}
                className={styles.mobile}
            >
                <CollapsibleTrigger className={styles.trigger}>
                    <Progress
                        value={progress}
                        variant="ring"
                        aria-hidden="true"
                    />
                    <span className={styles.triggerLabel}>{triggerLabel}</span>
                    <ChevronDown
                        className={cn(
                            styles.chevron,
                            open && styles.chevronOpen
                        )}
                        aria-hidden="true"
                    />
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <nav className={styles.list}>{links}</nav>
                </CollapsibleContent>
            </Collapsible>

            {/* Desktop: same as before */}
            <div className={styles.desktop}>
                <div className={styles.heading}>{heading}</div>
                <nav className={styles.list}>{links}</nav>
            </div>
        </aside>
    );
}
