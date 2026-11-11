import { NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set(["new", "contacted", "booked", "archived"]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid inquiry id" }, { status: 400 });
    }

    const body = await request.json();
    const status = typeof body.status === "string" ? body.status.trim() : "";

    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json(
        { error: "Status must be new, contacted, booked, or archived" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, numericId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ inquiry: updated });
  } catch (error) {
    console.error("PATCH /api/inquiries/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
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
      return NextResponse.json({ error: "Invalid inquiry id" }, { status: 400 });
    }

    const deleted = await db
      .delete(inquiries)
      .where(eq(inquiries.id, numericId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/inquiries/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
