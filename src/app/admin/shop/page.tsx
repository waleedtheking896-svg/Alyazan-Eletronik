import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { ensureProductsSeeded } from "@/db/shop-seed";
import { desc } from "drizzle-orm";
import AdminShopClient from "@/components/AdminShopClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop Manager — ALYAZEN" };

export default async function AdminShopPage() {
  await ensureProductsSeeded();
  const [plist, olist, items] = await Promise.all([
    db.select().from(products).orderBy(products.id),
    db.select().from(orders).orderBy(desc(orders.createdAt)),
    db.select().from(orderItems),
  ]);
  return (
    <AdminShopClient
      initialProducts={plist}
      initialOrders={olist.map((o) => ({ ...o, items: items.filter((i) => i.orderId === o.id) }))}
    />
  );
}
