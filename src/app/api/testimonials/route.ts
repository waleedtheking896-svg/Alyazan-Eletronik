import { NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeded();
    const list = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.id));
    return NextResponse.json({ testimonials: list });
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json(
      { error: "Failed to load testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json();
    const authorName =
      typeof body.authorName === "string" ? body.authorName.trim() : "";
    const authorRole =
      typeof body.authorRole === "string" && body.authorRole.trim()
        ? body.authorRole.trim()
        : "Client";
    const quote = typeof body.quote === "string" ? body.quote.trim() : "";
    const rating =
      typeof body.rating === "number" && body.rating >= 1 && body.rating <= 5
        ? Math.round(body.rating)
        : 5;

    if (!authorName || !quote) {
      return NextResponse.json(
        { error: "Client name and quote are required" },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(testimonials)
      .values({ authorName, authorRole, quote, rating })
      .returning();

    return NextResponse.json({ testimonial: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json(
      { error: "Failed to add testimonial" },
      { status: 500 }
    );
  }
}
