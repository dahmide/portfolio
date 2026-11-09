"use client";

import { IconContext } from "react-icons";

export function IconProvider({ children }: { children: React.ReactNode }) {
    return (
        <IconContext.Provider value={{ size: "1rem" }}>
            {children}
        </IconContext.Provider>
    );
}
