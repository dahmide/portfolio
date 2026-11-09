"use client";

import useSWR from "swr";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Book, BriefcaseBusiness as Work, Layers, MapPin } from "lucide-react";
import styles from "./About.module.css";
import { DiscIcon as Disc } from "../icons";
import { LocalTime } from "../shared/LocalTime";
import { Button } from "../ui/Button";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const github = site.social.github;
const resume = site.resumePath;
const status = ["now-playing", "last-played"];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function About({
    initialTime,
    initialData,
}: {
    initialTime: string;
    initialData: any;
}) {
    const { data } = useSWR("/api/spotify/playback", fetcher, {
        refreshInterval: 20000,
        fallbackData: initialData,
        // The server just fetched this, so skip the immediate refetch on mount.
        revalidateOnMount: false,
    });
    console.log("Track: ", data);
    return (
        <div className={styles.about}>
            <Eyebrow>A Little About Me</Eyebrow>
            <ul className={styles.aboutList}>
                <li className={styles.aboutItem}>
                    <Work />
                    <span>
                        I’m looking for a full-time frontend role, and I’m
                        building&nbsp;
                        <Button variant="link" href={github} external>
                            personal projects
                        </Button>
                        &nbsp;in the meantime. You can grab&nbsp;
                        <Button variant="link" href={resume} external>
                            my resume
                        </Button>
                        &nbsp;here.
                    </span>
                </li>
                <li className={styles.aboutItem}>
                    <Layers />
                    <span>
                        I work on frontend stuff: mainly design systems, UI
                        platforms, performance, and accessibility for web
                        interfaces.
                    </span>
                </li>
                <li className={styles.aboutItem}>
                    <Book />
                    <span>
                        I’m self-taught, with three years of coding behind me,
                        learned from the docs and by building things.
                    </span>
                </li>
                <li className={styles.aboutItem}>
                    <MapPin />
                    <span>
                        I’m based in Lagos. I'm open to different arrangement,
                        mostly remote and flexible. It’s currently&nbsp;
                        <LocalTime initialTime={initialTime} /> here.
                    </span>
                </li>
                <li
                    className={cn(styles.aboutItem, {
                        ["hidden"]: !status.includes(data.status),
                    })}
                >
                    <Disc />
                    {data.status === "now-playing" && (
                        <span>
                            Currently playing:&nbsp;
                            <Button variant="link" href="/">
                                {data.title} - {data.artist}
                            </Button>
                        </span>
                    )}
                    {data.status === "last-played" && (
                        <span>
                            Recently played:&nbsp;
                            <Button variant="link" href="/">
                                {data.title} - {data.artist}
                            </Button>
                        </span>
                    )}
                </li>
            </ul>
        </div>
    );
}
