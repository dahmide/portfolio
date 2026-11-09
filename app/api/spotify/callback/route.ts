import { NextRequest, NextResponse } from "next/server";
import { completeAuthorization } from "@/lib/spotify";

export const dynamic = "force-dynamic";

const getCallbackParams = (params: any) => {
    return Object.fromEntries(
        ["code", "state", "error"].map((k) => [k, params.get(k)])
    );
};

const getCallbackResult = (values: any, cookie: string | undefined) => {
    if (!values.code || !values.state || values.state !== cookie) {
        return { error: "Invalid State", code: null };
    } else {
        return { code: values.code };
    }
};

export async function GET(request: NextRequest) {
    const values = getCallbackParams(request.nextUrl.searchParams);

    if (values.error) {
        const err = values.error;
        return new NextResponse(`Spotify authorization failed: ${err}`, {
            status: 400,
        });
    }

    const cookie = request.cookies.get("spotify_auth_state")?.value;
    const result = getCallbackResult(
        { code: values.code, state: values.state },
        cookie
    );
    if (result.error) {
        const err = result.error;
        return new NextResponse(`Spotify authorization failed: ${err}`, {
            status: 400,
        });
    }

    try {
        await completeAuthorization(result.code);
    } catch (err) {
        console.error(err);
        return new NextResponse("Token exchange failed", { status: 500 });
    }

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("spotify_auth_state", "", {
        path: "/api/spotify",
        maxAge: 0,
    });
    return response;
}
