"use client";

import { cn } from "@/lib/utils";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import styles from "./Tabs.module.css";

function Tabs({
    className,
    orientation = "horizontal",
    ...props
}: TabsPrimitive.Root.Props) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            className={cn("", className)}
            {...props}
        />
    );
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            className={cn("", className)}
            {...props}
        />
    );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
    return (
        <TabsPrimitive.Tab
            data-slot="tabs-trigger"
            className={cn("", className)}
            {...props}
        />
    );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
    return (
        <TabsPrimitive.Panel
            data-slot="tabs-content"
            className={cn("", className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
