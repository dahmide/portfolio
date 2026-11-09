import { getRedis } from "@/lib/redis";
import { requireEnv } from "@/lib/env";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const SPOTIFY_URLS = {
    ACCOUNTS: "https://accounts.spotify.com",
    API: "https://api.spotify.com/v1",
};

const SPOTIFY_STORAGE_KEYS = {
    ACCESS_TOKEN: "spotify:access_token",
    REFRESH_TOKEN: "spotify:refresh_token",
    AUTHORIZED_AT: "spotify:authorized_at",
};

export const SPOTIFY_SCOPES = [
    "user-read-currently-playing",
    "user-read-recently-played",
].join(" ");

const DAY_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 5_000;

// Refresh tokens expire about 6 months after authorization.
const TOKEN_EXPIRY_DAYS = 180;
const REAUTH_WARNING_DAYS = 150;

// Access token cache: expire it a little before Spotify does.
const DEFAULT_ACCESS_TOKEN_TTL_S = 3600;
const ACCESS_TOKEN_SAFETY_MARGIN_S = 60;
const MIN_ACCESS_TOKEN_TTL_S = 30;

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type SpotifyImage = { url: string };

// The subset of Spotify's track/episode objects that we actually read.
type SpotifyItem = {
    type: "track" | "episode";
    name: string;
    show?: { name?: string };
    external_urls?: { spotify?: string };
    artists?: { name: string }[];
    album?: { images?: SpotifyImage[] };
    images?: SpotifyImage[];
};

type TrackInfo = {
    title: string;
    artist: string;
    albumArt: string | null;
    url: string | null;
};

export type NowPlaying =
    | ({ status: "now-playing" | "last-played" } & TrackInfo)
    | { status: "empty" | "renew" | "error" };

// Thrown only when authorization is missing or expired (needs a new login).
export class SpotifyAuthError extends Error {
    constructor(message = "Spotify authorization is missing or expired") {
        super(message);
        this.name = "SpotifyAuthError";
    }
}

/* -------------------------------------------------------------------------- */
/*  Auth                                                                      */
/* -------------------------------------------------------------------------- */

function basicAuth() {
    return btoa(
        `${requireEnv("SPOTIFY_CLIENT_ID")}:${requireEnv(
            "SPOTIFY_CLIENT_SECRET"
        )}`
    );
}

export function generateAuthUrl(state: string) {
    const params = new URLSearchParams({
        response_type: "code",
        client_id: requireEnv("SPOTIFY_CLIENT_ID"),
        scope: SPOTIFY_SCOPES,
        redirect_uri: requireEnv("SPOTIFY_REDIRECT_URI"),
        state,
    });

    return `${SPOTIFY_URLS.ACCOUNTS}/authorize?${params.toString()}`;
}

async function reqAccessToken(params: Record<string, string>) {
    const res = await fetch(`${SPOTIFY_URLS.ACCOUNTS}/api/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${basicAuth()}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(params),
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, json };
}

// Swaps the one-time login code for tokens and saves them.
export async function completeAuthorization(code: string) {
    const { ok, json } = await reqAccessToken({
        grant_type: "authorization_code",
        code,
        redirect_uri: requireEnv("SPOTIFY_REDIRECT_URI"),
    });

    if (!ok || !json.refresh_token) {
        throw new Error(
            `Spotify code exchange failed: ${json.error ?? "unknown"}`
        );
    }

    const redis = getRedis();
    await redis.set(SPOTIFY_STORAGE_KEYS.REFRESH_TOKEN, json.refresh_token);
    await redis.set(SPOTIFY_STORAGE_KEYS.AUTHORIZED_AT, Date.now());
    await redis.del(SPOTIFY_STORAGE_KEYS.ACCESS_TOKEN);
}

// Swaps the saved refresh token for a new access token and caches it.
async function refreshAccessToken(refreshToken: string): Promise<string> {
    const redis = getRedis();

    const { ok, json } = await reqAccessToken({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });

    if (!ok) {
        // Expired or revoked: discard everything and don't retry.
        if (json.error === "invalid_grant") {
            await redis.del(...Object.values(SPOTIFY_STORAGE_KEYS));
            throw new SpotifyAuthError();
        }
        throw new Error(
            `Spotify token refresh failed: ${json.error ?? "unknown"}`
        );
    }

    // Spotify may rotate the refresh token. If so, keep the new one.
    if (json.refresh_token && json.refresh_token !== refreshToken) {
        await redis.set(SPOTIFY_STORAGE_KEYS.REFRESH_TOKEN, json.refresh_token);
    }

    const ttlSeconds = Math.max(
        (json.expires_in ?? DEFAULT_ACCESS_TOKEN_TTL_S) -
            ACCESS_TOKEN_SAFETY_MARGIN_S,
        MIN_ACCESS_TOKEN_TTL_S
    );
    await redis.set(SPOTIFY_STORAGE_KEYS.ACCESS_TOKEN, json.access_token, {
        ex: ttlSeconds,
    });

    return json.access_token as string;
}

async function getAccessToken(): Promise<string> {
    const redis = getRedis();

    const cached = await redis.get<string>(SPOTIFY_STORAGE_KEYS.ACCESS_TOKEN);
    if (cached) return cached;

    const refreshToken = await redis.get<string>(
        SPOTIFY_STORAGE_KEYS.REFRESH_TOKEN
    );
    if (!refreshToken) throw new SpotifyAuthError();

    return refreshAccessToken(refreshToken);
}

// Private status for the admin route. Never send this to visitors.
export async function getAuthStatus() {
    const redis = getRedis();

    const [refreshToken, authorizedAt] = await Promise.all([
        redis.get<string>(SPOTIFY_STORAGE_KEYS.REFRESH_TOKEN),
        redis.get<number>(SPOTIFY_STORAGE_KEYS.AUTHORIZED_AT),
    ]);

    if (!refreshToken || !authorizedAt) {
        return { authorized: false as const };
    }

    const ageDays = Math.floor((Date.now() - Number(authorizedAt)) / DAY_MS);

    return {
        authorized: true as const,
        authorizedAt: new Date(Number(authorizedAt)).toISOString(),
        daysSinceAuthorization: ageDays,
        approxDaysLeft: Math.max(TOKEN_EXPIRY_DAYS - ageDays, 0),
        reauthorizeSoon: ageDays >= REAUTH_WARNING_DAYS,
    };
}

/* -------------------------------------------------------------------------- */
/*  Playback                                                                  */
/* -------------------------------------------------------------------------- */

async function spotifyGet(path: string) {
    const request = (token: string) =>
        fetch(`${SPOTIFY_URLS.API}${path}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

    let res = await request(await getAccessToken());

    // The cached access token was rejected (revoked or expired early):
    // clear it, get a fresh one, and retry once.
    if (res.status === 401) {
        await getRedis().del(SPOTIFY_STORAGE_KEYS.ACCESS_TOKEN);
        res = await request(await getAccessToken());
    }

    return res;
}

function fromSpotifyItem(item: SpotifyItem): TrackInfo {
    const isEpisode = item.type === "episode";

    const images = isEpisode ? item.images : item.album?.images;
    const artist = isEpisode
        ? item.show?.name
        : item.artists?.map(({ name }) => name).join(", ");

    return {
        title: item.name,
        artist: artist || "",
        albumArt: images?.[1]?.url ?? images?.[0]?.url ?? null,
        url: item.external_urls?.spotify ?? null,
    };
}

// Returns null when nothing is playing (204), when paused, or during ads.
async function fetchCurrentlyPlaying(): Promise<SpotifyItem | null> {
    const res = await spotifyGet(
        "/me/player/currently-playing?additional_types=track,episode"
    );

    if (res.status === 204) return null;
    if (!res.ok)
        throw new Error(`Spotify currently-playing failed: ${res.status}`);

    const data = await res.json();
    return data?.is_playing && data?.item ? data.item : null;
}

async function fetchLastPlayed(): Promise<SpotifyItem | null> {
    const res = await spotifyGet("/me/player/recently-played?limit=1");

    if (!res.ok)
        throw new Error(`Spotify recently-played failed: ${res.status}`);

    const data = await res.json();
    return data?.items?.[0]?.track ?? null;
}

export async function getNowPlaying(): Promise<NowPlaying> {
    const nowPlaying = await fetchCurrentlyPlaying();
    if (nowPlaying) {
        return { status: "now-playing", ...fromSpotifyItem(nowPlaying) };
    }

    const lastPlayed = await fetchLastPlayed();
    if (lastPlayed) {
        return { status: "last-played", ...fromSpotifyItem(lastPlayed) };
    }

    return { status: "empty" };
}

// Never throws: always returns something the UI can render.
// Shared by the API route and server components.
export async function getPlaybackState(): Promise<NowPlaying> {
    try {
        return await getNowPlaying();
    } catch (err) {
        if (err instanceof SpotifyAuthError) {
            console.warn(
                "Spotify reauthorization required. Visit /api/spotify/login?key=... to reauthorize."
            );
            return { status: "renew" };
        }

        console.error(err);
        return { status: "error" };
    }
}
