import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

// Compares two strings in constant time.
// Hashing first gives both sides the same length, which timingSafeEqual
// requires, and keeps the secret's length from leaking.
export function safeEqual(a: string, b: string): boolean {
    const hashA = createHash("sha256").update(a).digest();
    const hashB = createHash("sha256").update(b).digest();
    return timingSafeEqual(hashA, hashB);
}

// True when the request carries the correct ?key=<SPOTIFY_ADMIN_SECRET>.
export function isAdminRequest(request: NextRequest): boolean {
    const key = request.nextUrl.searchParams.get("key");
    const secret = process.env.SPOTIFY_ADMIN_SECRET;

    return Boolean(secret && key && safeEqual(key, secret));
}
