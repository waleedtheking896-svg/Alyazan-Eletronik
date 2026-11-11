import { NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeded();
    const list = await db
      .select()
      .from(services)
      .orderBy(asc(services.sortOrder), asc(services.id));
    return NextResponse.json({ services: list });
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json(
      { error: "Failed to load services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const category =
      typeof body.category === "string" && body.category.trim()
        ? body.category.trim()
        : "Core Service";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const priceLabel =
      typeof body.priceLabel === "string" && body.priceLabel.trim()
        ? body.priceLabel.trim()
        : "Custom Quote";
    const turnaround =
      typeof body.turnaround === "string" && body.turnaround.trim()
        ? body.turnaround.trim()
        : "Flexible";
    const featured = Boolean(body.featured);

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const existing = await db.select().from(services);
    const nextOrder = existing.length + 1;

    const [created] = await db
      .insert(services)
      .values({
        title,
        category,
        description,
        priceLabel,
        turnaround,
        featured,
        sortOrder: nextOrder,
      })
      .returning();

    return NextResponse.json({ service: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
