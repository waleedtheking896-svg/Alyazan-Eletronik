import { NextResponse } from "next/server";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const list = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const items = list.length
      ? await db.select().from(orderItems).where(inArray(orderItems.orderId, list.map((o) => o.id)))
      : [];
    return NextResponse.json({
      orders: list.map((o) => ({ ...o, items: items.filter((i) => i.orderId === o.id) })),
    });
  } catch (error) {
    console.error("GET /api/orders", error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

class OrderError extends Error {}

export async function POST(request: Request) {
  try {
    const b = await request.json();
    const customerName = typeof b.customerName === "string" ? b.customerName.trim() : "";
    const phone = typeof b.phone === "string" ? b.phone.trim() : "";
    const rawItems: unknown = b.items;
    if (!customerName || !phone) {
      return NextResponse.json({ error: "Please enter your name and phone number." }, { status: 400 });
    }
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }
    const wanted = new Map<number, number>();
    for (const it of rawItems as { productId?: unknown; quantity?: unknown }[]) {
      const pid = Number(it.productId);
      const qty = Math.floor(Number(it.quantity));
      if (!Number.isInteger(pid) || pid <= 0 || !Number.isFinite(qty) || qty <= 0) continue;
      wanted.set(pid, (wanted.get(pid) ?? 0) + qty);
    }
    if (wanted.size === 0) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });

    const order = await db.transaction(async (tx) => {
      const rows = await tx.select().from(products).where(inArray(products.id, [...wanted.keys()])).for("update");
      let total = 0;
      const lines: { productId: number; productName: string; unitPriceCents: number; quantity: number }[] = [];
      for (const [pid, qty] of wanted) {
        const p = rows.find((r) => r.id === pid);
        if (!p || !p.active) throw new OrderError("A product in your cart is no longer available.");
        if (p.stock < qty) throw new OrderError(`Only ${p.stock} left of "${p.name}".`);
        total += p.priceCents * qty;
        lines.push({ productId: pid, productName: p.name, unitPriceCents: p.priceCents, quantity: qty });
      }
      const [created] = await tx
        .insert(orders)
        .values({
          customerName,
          phone,
          email: typeof b.email === "string" ? b.email.trim() : "",
          note: typeof b.note === "string" ? b.note.trim() : "",
          pickupDate: typeof b.pickupDate === "string" ? b.pickupDate.trim() : "",
          totalCents: total,
        })
        .returning();
      await tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: created.id })));
      for (const l of lines) {
        const p = rows.find((r) => r.id === l.productId)!;
        await tx.update(products).set({ stock: p.stock - l.quantity }).where(eq(products.id, l.productId));
      }
      return created;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("POST /api/orders", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
