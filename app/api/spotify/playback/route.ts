import { NextResponse } from "next/server";
import { getPlaybackState } from "@/lib/spotify";

export const dynamic = "force-dynamic";

// Vercel's CDN serves this for 10s, so many visitors share one Spotify call.
const CACHE_TRACK = {
    "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20",
};
const CACHE_RENEW = {
    "Cache-Control": "public, s-maxage=60",
};
const CACHE_STORE = { "Cache-Control": "no-store" };

export async function GET() {
    const data = await getPlaybackState();

    if (data.status === "error") {
        return NextResponse.json(data, { status: 500, headers: CACHE_STORE });
    }

    if (data.status === "renew") {
        return NextResponse.json(data, { status: 500, headers: CACHE_RENEW });
    }

    return NextResponse.json(data, { headers: CACHE_TRACK });
}
