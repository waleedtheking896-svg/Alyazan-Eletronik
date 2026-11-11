import { NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid service id" }, { status: 400 });
    }

    const body = await request.json();
    const existingRows = await db
      .select()
      .from(services)
      .where(eq(services.id, numericId));
    const current = existingRows[0];
    if (!current) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(services)
      .set({
        title:
          typeof body.title === "string" && body.title.trim()
            ? body.title.trim()
            : current.title,
        category:
          typeof body.category === "string" && body.category.trim()
            ? body.category.trim()
            : current.category,
        description:
          typeof body.description === "string" && body.description.trim()
            ? body.description.trim()
            : current.description,
        priceLabel:
          typeof body.priceLabel === "string" && body.priceLabel.trim()
            ? body.priceLabel.trim()
            : current.priceLabel,
        turnaround:
          typeof body.turnaround === "string" && body.turnaround.trim()
            ? body.turnaround.trim()
            : current.turnaround,
        featured:
          typeof body.featured === "boolean" ? body.featured : current.featured,
      })
      .where(eq(services.id, numericId))
      .returning();

    return NextResponse.json({ service: updated });
  } catch (error) {
    console.error("PATCH /api/services/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid service id" }, { status: 400 });
    }

    const deleted = await db
      .delete(services)
      .where(eq(services.id, numericId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/services/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
