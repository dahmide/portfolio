import type { Metadata } from "next";
// import { Geist } from "next/font/google";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/config/site";
// import { LucideProvider } from "@/context/LucideProvider";
import { IconProvider } from "@/context/IconProvider";
import "../styles/globals.css";
import "github-markdown-css/github-markdown.css";

const head = localFont({
    src: "../public/fonts/Sentient.woff2",
    variable: "--ff-head",
    display: "swap",
});

const body = localFont({
    src: "../public/fonts/Excon.woff2",
    variable: "--ff-body",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: site.title,
        template: `%s - ${site.name}`,
    },
    description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={`${head.variable} ${body.variable}`}>
            <body>
                <div className="root">
                    <IconProvider>
                        <Header />
                        <main>{children}</main>
                        <Footer />
                    </IconProvider>
                </div>
            </body>
        </html>
    );
}
