import { NextRequest, NextResponse } from "next/server";
import { getAuthStatus } from "@/lib/spotify";
import { isAdminRequest } from "@/lib/utils/server";

export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
    if (!isAdminRequest(request)) {
        return new NextResponse("Not found", { status: 404 });
    }

    try {
        const status = await getAuthStatus();

        // 503 tells an uptime monitor to alert you.
        if (!status.authorized) {
            return NextResponse.json(
                { ok: false, reason: "not-authorized", ...status },
                { status: 503, headers }
            );
        }

        if (status.reauthorizeSoon) {
            return NextResponse.json(
                { ok: false, reason: "reauthorize-soon", ...status },
                { status: 503, headers }
            );
        }

        return NextResponse.json({ ok: true, ...status }, { headers });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { ok: false, reason: "check-failed" },
            { status: 503, headers }
        );
    }
}
