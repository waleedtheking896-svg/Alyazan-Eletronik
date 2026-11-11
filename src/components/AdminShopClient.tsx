"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, Plus, ShoppingCart, Trash2 } from "lucide-react";
import type { OrderItemRow, OrderRow, ProductItem } from "@/db/schema";
import LogoutButton from "@/components/LogoutButton";
import { formatPrice, ORDER_STATUS_LABEL, ORDER_STATUSES, orderNumber, PRODUCT_CATEGORIES } from "@/lib/shop";

type OrderWithItems = OrderRow & { items: OrderItemRow[] };

const IMAGES = [
  { label: "Phones", url: "/images/alyazen-phones.png" },
  { label: "Laptops", url: "/images/alyazen-laptops.png" },
  { label: "Boards", url: "/images/alyazen-boards.png" },
  { label: "Accessories", url: "/images/alyazen-accessories.png" },
];

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-blue-950 text-blue-300",
  ready: "bg-amber-950 text-amber-300",
  picked_up: "bg-emerald-950 text-emerald-300",
  cancelled: "bg-neutral-800 text-neutral-400",
};

export default function AdminShopClient({
  initialProducts,
  initialOrders,
}: {
  initialProducts: ProductItem[];
  initialOrders: OrderWithItems[];
}) {
  const [tab, setTab] = useState<"orders" | "products">("orders");
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState<string | null>(null);
  const [np, setNp] = useState({ name: "", brand: "", category: "Phones", price: "", oldPrice: "", stock: "1", description: "", imageUrl: IMAGES[0].url, featured: false });

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const stats = useMemo(() => ({
    pending: orders.filter((o) => o.status === "pending").length,
    ready: orders.filter((o) => o.status === "ready").length,
    revenue: orders.filter((o) => o.status === "picked_up").reduce((s, o) => s + o.totalCents, 0),
    lowStock: products.filter((p) => p.stock <= 3).length,
  }), [orders, products]);

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const refreshProducts = async () => {
    const r = await fetch("/api/products");
    if (r.ok) setProducts((await r.json()).products);
  };

  const setStatus = async (id: number, status: string) => {
    const r = await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const d = await r.json();
    if (r.ok) {
      setOrders((os) => os.map((o) => (o.id === id ? { ...o, ...d.order } : o)));
      if (status === "cancelled") await refreshProducts();
      flash(`${orderNumber(id)} → ${ORDER_STATUS_LABEL[d.order.status]}`);
    }
  };

  const patchProduct = async (id: number, body: Record<string, unknown>) => {
    const r = await fetch(`/api/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json();
    if (r.ok) { setProducts((ps) => ps.map((p) => (p.id === id ? d.product : p))); flash("Product updated"); }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const r = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (r.ok) { setProducts((ps) => ps.filter((p) => p.id !== id)); flash("Product deleted"); }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(np) });
    const d = await r.json();
    if (r.ok) {
      setProducts((ps) => [...ps, d.product]);
      setNp({ ...np, name: "", brand: "", price: "", oldPrice: "", stock: "1", description: "" });
      flash("Product added to shop");
    } else flash(d.error || "Error");
  };

  const input = "w-full rounded-lg border border-[#3a3a3a] bg-[#111] px-3 py-2 text-sm text-slate-100 outline-none focus:border-[#C9A227]";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-[#C9A227]/30 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="inline-flex items-center gap-1 rounded-full border border-[#3a3a3a] px-3 py-1.5 text-xs text-slate-300 hover:border-[#C9A227]"><ArrowLeft className="h-3.5 w-3.5" /> Site Admin</Link>
            <span className="font-extrabold text-[#F2D16B]">Shop Manager</span>
          </div>
          <div className="flex items-center gap-2"><Link href="/shop" className="rounded-full bg-[#C9A227] px-4 py-1.5 text-xs font-bold text-black">View Shop</Link><Link href="/admin/security" className="rounded-full border border-[#3a3a3a] px-4 py-1.5 text-xs text-slate-300 hover:border-[#C9A227]">Passwort ändern</Link><LogoutButton className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#3a3a3a] px-4 py-1.5 text-xs text-slate-300 hover:border-[#C9A227]" /></div>
        </div>
      </header>

      {toast && <div className="fixed right-5 bottom-5 z-50 rounded-xl bg-[#C9A227] px-4 py-2.5 text-xs font-bold text-black shadow-xl">{toast}</div>}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["New orders", stats.pending],
            ["Ready for pickup", stats.ready],
            ["Revenue (picked up)", formatPrice(stats.revenue)],
            ["Low stock (≤3)", stats.lowStock],
          ].map(([l, v]) => (
            <div key={String(l)} className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4">
              <p className="text-xs text-slate-400">{l}</p>
              <p className="mt-1 font-mono text-2xl font-bold text-[#F2D16B]">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          {([["orders", "Orders", ShoppingCart], ["products", "Products & Stock", Package]] as const).map(([k, l, Icon]) => (
            <button key={k} onClick={() => setTab(k)} className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${tab === k ? "bg-[#C9A227] text-black" : "border border-[#2a2a2a] text-slate-300"}`}>
              <Icon className="h-3.5 w-3.5" /> {l}
            </button>
          ))}
        </div>

        {tab === "orders" && (
          <section className="mt-6">
            <div className="mb-4 flex flex-wrap gap-1.5">
              {["all", ...ORDER_STATUSES].map((s) => (
                <button key={s} onClick={() => setFilter(s)} className={`cursor-pointer rounded-full px-3 py-1 text-xs ${filter === s ? "bg-slate-100 text-black" : "border border-[#2a2a2a] text-slate-400"}`}>
                  {s === "all" ? "All" : ORDER_STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            {shown.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[#2a2a2a] p-10 text-center text-sm text-slate-500">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {shown.map((o) => (
                  <div key={o.id} className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-5">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#F2D16B]">{orderNumber(o.id)}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_COLOR[o.status]}`}>{ORDER_STATUS_LABEL[o.status]}</span>
                          <span className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold">{o.customerName} · <a href={`tel:${o.phone}`} className="text-[#F2D16B]">{o.phone}</a>{o.email && <span className="text-slate-400"> · {o.email}</span>}</p>
                        {o.pickupDate && <p className="text-xs text-slate-400">Pickup: {o.pickupDate}</p>}
                        <ul className="mt-2 text-xs text-slate-300">
                          {o.items.map((i) => <li key={i.id}>{i.quantity}× {i.productName} — {formatPrice(i.unitPriceCents * i.quantity)}</li>)}
                        </ul>
                        {o.note && <p className="mt-2 rounded bg-black p-2 text-xs text-slate-400">“{o.note}”</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-mono text-lg font-bold text-[#F2D16B]">{formatPrice(o.totalCents)}</span>
                        {o.status !== "cancelled" && (
                          <div className="flex flex-wrap justify-end gap-1.5">
                            {o.status === "pending" && <button onClick={() => setStatus(o.id, "ready")} className="cursor-pointer rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black">Mark Ready</button>}
                            {o.status !== "picked_up" && <button onClick={() => setStatus(o.id, "picked_up")} className="cursor-pointer rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-black">Picked Up & Paid</button>}
                            {o.status !== "picked_up" && <button onClick={() => confirm("Cancel order and return stock?") && setStatus(o.id, "cancelled")} className="cursor-pointer rounded-lg border border-[#3a3a3a] px-3 py-1.5 text-xs text-slate-300">Cancel</button>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "products" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="space-y-2 lg:col-span-8">
              {products.map((p) => (
                <div key={p.id} className={`flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#141414] p-3 ${!p.active ? "opacity-50" : ""}`}>
                  <img src={p.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-[11px] text-slate-500">{p.brand} · {p.category}</p>
                  </div>
                  <label className="text-[11px] text-slate-400">Price
                    <input type="number" step="0.01" defaultValue={(p.priceCents / 100).toFixed(2)} onBlur={(e) => Number(e.target.value) * 100 !== p.priceCents && patchProduct(p.id, { price: e.target.value })} className="mt-0.5 block w-24 rounded border border-[#3a3a3a] bg-black px-2 py-1 font-mono text-xs text-[#F2D16B]" />
                  </label>
                  <label className={`text-[11px] ${p.stock <= 3 ? "text-amber-400" : "text-slate-400"}`}>Stock
                    <input type="number" min={0} defaultValue={p.stock} key={`s${p.id}-${p.stock}`} onBlur={(e) => Number(e.target.value) !== p.stock && patchProduct(p.id, { stock: e.target.value })} className="mt-0.5 block w-16 rounded border border-[#3a3a3a] bg-black px-2 py-1 font-mono text-xs" />
                  </label>
                  <button onClick={() => patchProduct(p.id, { featured: !p.featured })} title="Featured" className={`cursor-pointer rounded px-2 py-1 text-xs ${p.featured ? "bg-[#C9A227] text-black" : "border border-[#3a3a3a] text-slate-500"}`}>★</button>
                  <button onClick={() => patchProduct(p.id, { active: !p.active })} className="cursor-pointer rounded border border-[#3a3a3a] px-2 py-1 text-[11px] text-slate-300">{p.active ? "Hide" : "Show"}</button>
                  <button onClick={() => deleteProduct(p.id)} className="cursor-pointer text-slate-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>

            <form onSubmit={addProduct} className="h-fit space-y-3 rounded-2xl border border-[#2a2a2a] bg-[#141414] p-5 lg:col-span-4">
              <h3 className="flex items-center gap-2 font-bold text-[#F2D16B]"><Plus className="h-4 w-4" /> Add Product</h3>
              <input required placeholder="Product name *" value={np.name} onChange={(e) => setNp({ ...np, name: e.target.value })} className={input} />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Brand" value={np.brand} onChange={(e) => setNp({ ...np, brand: e.target.value })} className={input} />
                <select value={np.category} onChange={(e) => setNp({ ...np, category: e.target.value })} className={input}>
                  {PRODUCT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input required type="number" step="0.01" min="0" placeholder="Price *" value={np.price} onChange={(e) => setNp({ ...np, price: e.target.value })} className={input} />
                <input type="number" step="0.01" min="0" placeholder="Old price" value={np.oldPrice} onChange={(e) => setNp({ ...np, oldPrice: e.target.value })} className={input} />
                <input type="number" min="0" placeholder="Stock" value={np.stock} onChange={(e) => setNp({ ...np, stock: e.target.value })} className={input} />
              </div>
              <textarea rows={3} placeholder="Description" value={np.description} onChange={(e) => setNp({ ...np, description: e.target.value })} className={input} />
              <input placeholder="Image URL" value={np.imageUrl} onChange={(e) => setNp({ ...np, imageUrl: e.target.value })} className={input} />
              <div className="flex flex-wrap gap-1">
                {IMAGES.map((i) => <button type="button" key={i.url} onClick={() => setNp({ ...np, imageUrl: i.url })} className={`cursor-pointer rounded px-2 py-0.5 text-[11px] ${np.imageUrl === i.url ? "bg-[#C9A227] text-black" : "border border-[#3a3a3a] text-slate-400"}`}>{i.label}</button>)}
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={np.featured} onChange={(e) => setNp({ ...np, featured: e.target.checked })} /> Featured</label>
              <button className="w-full cursor-pointer rounded-xl bg-[#C9A227] py-2.5 text-sm font-bold text-black">Add to Shop</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
