import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeded();
    const list = await db
      .select()
      .from(projects)
      .orderBy(asc(projects.sortOrder), asc(projects.id));
    return NextResponse.json({ projects: list });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to load showcase projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const clientName =
      typeof body.clientName === "string" && body.clientName.trim()
        ? body.clientName.trim()
        : "Featured Client";
    const category =
      typeof body.category === "string" && body.category.trim()
        ? body.category.trim()
        : "Case Study";
    const summary =
      typeof body.summary === "string" ? body.summary.trim() : "";
    const metricLabel =
      typeof body.metricLabel === "string" && body.metricLabel.trim()
        ? body.metricLabel.trim()
        : "Client Success";
    const imageUrl =
      typeof body.imageUrl === "string" && body.imageUrl.trim()
        ? body.imageUrl.trim()
        : "/images/project-1.png";

    if (!title || !summary) {
      return NextResponse.json(
        { error: "Project title and summary are required" },
        { status: 400 }
      );
    }

    const existing = await db.select().from(projects);
    const [created] = await db
      .insert(projects)
      .values({
        title,
        clientName,
        category,
        summary,
        metricLabel,
        imageUrl,
        sortOrder: existing.length + 1,
      })
      .returning();

    return NextResponse.json({ project: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
