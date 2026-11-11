import { notFound } from "next/navigation";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { getFullSiteData } from "@/db/seed";
import { eq } from "drizzle-orm";
import OrderView from "@/components/OrderView";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) notFound();
  const [items, { profile }] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, id)),
    getFullSiteData(),
  ]);

  return (
    <OrderView
      order={order}
      items={items}
      storeAddress={profile.address}
      storeHours={profile.hours}
    />
  );
}
