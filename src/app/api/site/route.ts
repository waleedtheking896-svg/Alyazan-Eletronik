import { NextResponse } from "next/server";
import { getFullSiteData } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getFullSiteData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/site error:", error);
    return NextResponse.json(
      { error: "Failed to load site data" },
      { status: 500 }
    );
  }
}
