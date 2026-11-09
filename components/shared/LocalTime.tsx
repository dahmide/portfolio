"use client";

import { useEffect, useState } from "react";
import styles from "./LocalTime.module.css";
import { cn } from "@/lib/utils";

const DEFAULT_TIME_ZONE = "Africa/Lagos";
const ZONE_LABELS: Record<string, string> = {
    "Africa/Lagos": "WAT",
    "Europe/London": "GMT", // or handle BST separately if you care
};

const formatTime = (date: Date, timeZone: string): string => {
    return new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
};

const formatZone = (date: Date, timeZone: string): string => {
    if (ZONE_LABELS[timeZone]) return ZONE_LABELS[timeZone];
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "short",
    }).formatToParts(date);
    return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
};

export function LocalTime({
    timeZone = DEFAULT_TIME_ZONE,
    hour12 = true,
    className,
    intervalMs = 30_000,
    initialTime,
}: {
    timeZone?: string;
    hour12?: boolean;
    className?: string;
    intervalMs?: number;
    /** From the server — first paint shows real time, not —:— */
    initialTime: string;
}) {
    const [time, setTime] = useState(initialTime);
    const [abbr, setAbbr] = useState("");

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(formatTime(now, timeZone));
            setAbbr(formatZone(now, timeZone));
        };
        tick(); // refresh immediately on mount
        const id = window.setInterval(tick, intervalMs);
        return () => window.clearInterval(id);
    }, [timeZone, hour12, intervalMs]);

    const dateTime = new Date().toLocaleString("en-CA", {
        timeZone,
        hour12: false,
    });

    return (
        <time
            className={cn(styles.time, className)}
            // dateTime={dateTime}
            title={timeZone}
        >
            {time}
            {abbr ? ` ${abbr}` : ""}
        </time>
    );
}
