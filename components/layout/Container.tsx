import { cn } from "@/lib/utils";
import styles from "./Container.module.css";

export function Container({
    children,
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn(styles.container, className)} {...props}>
            {children}
        </div>
    );
}
