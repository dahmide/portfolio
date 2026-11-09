import { LucideProvider as LucideIconProvider } from "lucide-react";

export function LucideProvider({ children }: { children: React.ReactNode }) {
    return (
        <LucideIconProvider size={16} strokeWidth={2}>
            {children}
        </LucideIconProvider>
    );
}
