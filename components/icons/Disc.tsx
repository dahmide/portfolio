"use client";

import type { HTMLAttributes } from "react";
import { motion, useAnimation } from "motion/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface Disc3IconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
    playing?: boolean;
}

function Disc3Icon({
    className,
    size = 28,
    playing = false,
    ...props
}: Disc3IconProps) {
    const controls = useAnimation();

    useEffect(() => {
        controls.start(playing ? "animate" : "normal");
    }, [playing, controls]);

    return (
        <div className={cn(className)} {...props}>
            <svg
                fill="none"
                height={size}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width={size}
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="2" />

                <motion.g
                    animate={controls}
                    initial="normal"
                    style={{ transformOrigin: "12px 12px" }}
                    variants={{
                        normal: {
                            rotate: 0,
                            transition: { duration: 0.4, ease: "easeInOut" },
                        },
                        animate: {
                            rotate: [0, 360],
                            transition: {
                                duration: 2,
                                ease: "linear",
                                repeat: Number.POSITIVE_INFINITY,
                            },
                        },
                    }}
                >
                    <path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
                    <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
                </motion.g>
            </svg>
        </div>
    );
}

Disc3Icon.displayName = "Disc3Icon";

export { Disc3Icon };
