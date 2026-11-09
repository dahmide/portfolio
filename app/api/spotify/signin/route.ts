import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/utils/server";
import { generateAuthUrl } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    if (!isAdminRequest(request)) {
        return new NextResponse("Not found", { status: 404 });
    }

    const state = crypto.randomUUID();
    const response = NextResponse.redirect(generateAuthUrl(state));

    response.cookies.set("spotify_auth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600,
        path: "/api/spotify",
    });

    return response;
}
