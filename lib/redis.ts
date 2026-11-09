import "server-only";

import { Redis } from "@upstash/redis";
import { requireEnv } from "@/lib/env";

// Created lazily so a missing variable never breaks `next build`.
let client: Redis | null = null;

export function getRedis(): Redis {
    client ??= new Redis({
        url: requireEnv("UPSTASH_REDIS_REST_URL", "KV_REST_API_URL"),
        token: requireEnv("UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_TOKEN"),
    });
    return client;
}
