import type { Metadata } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ensureProductsSeeded } from "@/db/shop-seed";
import { getFullSiteData } from "@/db/seed";
import { eq } from "drizzle-orm";
import ShopClient from "@/components/ShopClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop — ALYAZEN Electronics",
  description: "Order phones, laptops, boards and electronics online — pick up in store.",
};

export default async function ShopPage() {
  await ensureProductsSeeded();
  const [{ profile }, list] = await Promise.all([
    getFullSiteData(),
    db.select().from(products).where(eq(products.active, true)),
  ]);
  return <ShopClient products={list} storeAddress={profile.address} storeHours={profile.hours} />;
}
