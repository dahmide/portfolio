import { cn } from "@/lib/utils";
import styles from "./Markdown.module.css";

export function Markdown({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("markdown-body", className)} {...props}>
            {children}
        </div>
    );
}
