import { NextResponse } from "next/server";
import { applyPresetToDatabase } from "@/db/seed";
import { BUSINESS_PRESETS } from "@/lib/presets";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const presetKey = typeof body.presetKey === "string" ? body.presetKey : "";

    const valid = BUSINESS_PRESETS.some((p) => p.key === presetKey);
    if (!valid) {
      return NextResponse.json(
        { error: "Unknown preset template selected" },
        { status: 400 }
      );
    }

    const data = await applyPresetToDatabase(presetKey);
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /api/preset error:", error);
    return NextResponse.json(
      { error: "Failed to apply business template" },
      { status: 500 }
    );
  }
}
