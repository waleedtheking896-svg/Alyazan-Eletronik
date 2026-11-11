import { NextResponse } from "next/server";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { ORDER_STATUSES } from "@/lib/shop";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await ctx.params).id);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const b = await request.json();
    const status = String(b.status ?? "");
    if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const updated = await db.transaction(async (tx) => {
      const [current] = await tx.select().from(orders).where(eq(orders.id, id)).for("update");
      if (!current) return null;
      if (current.status === "cancelled") return current;
      // Return stock when an order is cancelled (once).
      if (status === "cancelled" && current.status !== "cancelled") {
        const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, id));
        for (const it of items) {
          if (it.productId)
            await tx.update(products).set({ stock: sql`${products.stock} + ${it.quantity}` }).where(eq(products.id, it.productId));
        }
      }
      const [u] = await tx.update(orders).set({ status }).where(eq(orders.id, id)).returning();
      return u;
    });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order: updated });
  } catch (error) {
    console.error("PATCH /api/orders/[id]", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
