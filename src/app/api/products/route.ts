import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ensureProductsSeeded } from "@/db/shop-seed";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureProductsSeeded();
    const list = await db.select().from(products).orderBy(desc(products.featured), products.id);
    return NextResponse.json({ products: list });
  } catch (error) {
    console.error("GET /api/products", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const b = await request.json();
    const name = typeof b.name === "string" ? b.name.trim() : "";
    const price = Number(b.price);
    if (!name || !Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Name and valid price are required" }, { status: 400 });
    }
    const oldPrice = Number(b.oldPrice);
    const [created] = await db
      .insert(products)
      .values({
        name,
        brand: typeof b.brand === "string" ? b.brand.trim() : "",
        category: typeof b.category === "string" && b.category.trim() ? b.category.trim() : "Electronics",
        description: typeof b.description === "string" ? b.description.trim() : "",
        priceCents: Math.round(price * 100),
        oldPriceCents: Number.isFinite(oldPrice) && oldPrice > 0 ? Math.round(oldPrice * 100) : null,
        stock: Math.max(0, Math.floor(Number(b.stock) || 0)),
        imageUrl: typeof b.imageUrl === "string" && b.imageUrl.trim() ? b.imageUrl.trim() : "/images/alyazen-accessories.png",
        featured: Boolean(b.featured),
      })
      .returning();
    return NextResponse.json({ product: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
