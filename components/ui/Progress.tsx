"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "@/lib/utils";
import styles from "./Progress.module.css";

const SIZE = 18;
const STROKE = 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type ProgressProps = Omit<
    ProgressPrimitive.Root.Props,
    "className" | "value"
> & {
    /** Current progress, 0 to 100. */
    value: number;
    variant?: "ring" | "pipe";
    className?: string;
};

export function Progress({
    value,
    variant = "ring",
    className,
    ...props
}: ProgressProps) {
    return (
        <ProgressPrimitive.Root
            value={value}
            className={cn(styles.root, styles[variant], className)}
            {...props}
        >
            {variant === "pipe" ? (
                <ProgressPrimitive.Track className={styles.track}>
                    <ProgressPrimitive.Indicator className={styles.indicator} />
                </ProgressPrimitive.Track>
            ) : (
                <svg
                    className={styles.ring}
                    width={SIZE}
                    height={SIZE}
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    aria-hidden="true"
                >
                    <circle
                        className={styles.ringTrack}
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                    />
                    <circle
                        className={styles.ringIndicator}
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={CIRCUMFERENCE * (1 - value / 100)}
                    />
                </svg>
            )}
        </ProgressPrimitive.Root>
    );
}
