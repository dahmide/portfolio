import { cn } from "@/lib/utils";
import styles from "./Eyebrow.module.css";

export function Eyebrow({ className, ...props }: React.ComponentProps<"span">) {
    return <span className={cn(styles.eyebrow, className)} {...props} />;
}
