import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const id = Number((await ctx.params).id);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const b = await request.json();
    const update: Partial<typeof products.$inferInsert> = {};
    if (typeof b.name === "string" && b.name.trim()) update.name = b.name.trim();
    if (typeof b.description === "string") update.description = b.description.trim();
    if (typeof b.category === "string" && b.category.trim()) update.category = b.category.trim();
    if (b.price !== undefined && Number.isFinite(Number(b.price)) && Number(b.price) >= 0)
      update.priceCents = Math.round(Number(b.price) * 100);
    if (b.stock !== undefined && Number.isFinite(Number(b.stock)))
      update.stock = Math.max(0, Math.floor(Number(b.stock)));
    if (typeof b.featured === "boolean") update.featured = b.featured;
    if (typeof b.active === "boolean") update.active = b.active;
    if (Object.keys(update).length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    const [updated] = await db.update(products).set(update).where(eq(products.id, id)).returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("PATCH /api/products/[id]", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    const id = Number((await ctx.params).id);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const deleted = await db.delete(products).where(eq(products.id, id)).returning();
    if (deleted.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/products/[id]", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
