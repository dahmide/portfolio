import { cn } from "@/lib/utils";
import styles from "./Section.module.css";

export function Section({
    children,
    className,
    size = "base",
    ...props
}: React.ComponentProps<"section"> & {
    size?: "lg" | "base" | "sm";
}) {
    return (
        <section className={cn(styles.section, className)} {...props}>
            {children}
        </section>
    );
}
