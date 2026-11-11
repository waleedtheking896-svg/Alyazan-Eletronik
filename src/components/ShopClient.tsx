"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Search, ShoppingBag, Store, Trash2, X } from "lucide-react";
import type { ProductItem } from "@/db/schema";
import AlyazenLogo from "@/components/AlyazenLogo";
import { LanguageToggle, useLang } from "@/components/LanguageProvider";
import { PRODUCT_CATEGORIES, formatPrice } from "@/lib/shop";

type Cart = Record<number, number>;
const CART_KEY = "alyazen-cart";

export default function ShopClient({
  products,
  storeAddress,
  storeHours,
}: {
  products: ProductItem[];
  storeAddress: string;
  storeHours: string;
}) {
  const router = useRouter();
  const { t } = useLang();
  const [cart, setCart] = useState<Cart>({});
  const [loaded, setLoaded] = useState(false);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [detail, setDetail] = useState<ProductItem | null>(null);
  const [form, setForm] = useState({ customerName: "", phone: "", email: "", pickupDate: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, loaded]);

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ product: byId.get(Number(id)), qty }))
        .filter((l): l is { product: ProductItem; qty: number } => Boolean(l.product) && l.qty > 0),
    [cart, byId]
  );
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.product.priceCents, 0);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!q || `${p.name} ${p.brand} ${p.description}`.toLowerCase().includes(q))
    );
    if (sort === "price-asc") list.sort((a, b) => a.priceCents - b.priceCents);
    else if (sort === "price-desc") list.sort((a, b) => b.priceCents - a.priceCents);
    else list.sort((a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id);
    return list;
  }, [products, category, query, sort]);

  const setQty = (id: number, qty: number) => {
    const p = byId.get(id);
    if (!p) return;
    const clamped = Math.max(0, Math.min(qty, p.stock));
    setCart((c) => {
      const next = { ...c };
      if (clamped === 0) delete next[id];
      else next[id] = clamped;
      return next;
    });
  };

  const add = (p: ProductItem) => {
    setQty(p.id, (cart[p.id] ?? 0) + 1);
    setCartOpen(true);
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: lines.map((l) => ({ productId: l.product.id, quantity: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not place order.");
        return;
      }
      setCart({});
      localStorage.removeItem(CART_KEY);
      router.push(`/order/${data.order.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const input =
    "w-full rounded-xl border border-[#3a3a3a] bg-[#111] px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-[#C9A227]";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-[#C9A227]/30 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <AlyazenLogo className="h-10 w-10" />
            <div>
              <p className="text-base font-extrabold tracking-wider text-[#F2D16B]">ALYAZEN</p>
              <p className="text-[11px] text-slate-400">{t("shop.onlineLabel")}</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/" className="hover:text-[#F2D16B]">{t("nav.home")}</Link>
            <Link href="/shop" className="text-[#F2D16B]">{t("nav.shop")}</Link>
            <Link href="/#contact" className="hover:text-[#F2D16B]">{t("nav.contact")}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => setCartOpen(true)}
              className="relative inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#C9A227] px-4 py-2 text-sm font-bold text-black hover:bg-[#E0B83A]"
            >
              <ShoppingBag className="h-4 w-4" />
              {t("shop.cart")}
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[11px] text-[#F2D16B]">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Pickup notice */}
      <div className="border-b border-[#2a2a2a] bg-gradient-to-r from-[#1a1505] via-[#111] to-[#1a1505]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center text-xs text-slate-300">
          <Store className="h-4 w-4 text-[#C9A227]" />
          <span className="font-semibold text-[#F2D16B]">{t("shop.pickupNotice")}</span>
          <span className="text-slate-500">·</span>
          <span>{storeAddress}</span>
          <span className="text-slate-500">·</span>
          <span>{storeHours}</span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-[#F2D16B] sm:text-4xl">{t("shop.title")}</h1>
          <p className="text-sm text-slate-400">{t("shop.subtitle")}</p>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {["All", ...PRODUCT_CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition ${
                  category === c
                    ? "bg-[#C9A227] text-black"
                    : "border border-[#2a2a2a] bg-[#141414] text-slate-300 hover:border-[#C9A227]/60"
                }`}
              >
                {c === "All" ? t("shop.all") : t(`cat.${c}`)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("shop.search")}
                className={`${input} ps-9`}
              />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${input} w-auto`}>
              <option value="featured">{t("shop.sortFeatured")}</option>
              <option value="price-asc">{t("shop.sortAsc")}</option>
              <option value="price-desc">{t("shop.sortDesc")}</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <p className="mt-16 text-center text-slate-500">{t("shop.noProducts")}</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => {
              const inCart = cart[p.id] ?? 0;
              const soldOut = p.stock <= 0;
              return (
                <div
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#141414] transition hover:border-[#C9A227]/60"
                >
                  <button onClick={() => setDetail(p)} className="relative aspect-square cursor-pointer overflow-hidden bg-black">
                    <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    {p.oldPriceCents && p.oldPriceCents > p.priceCents && (
                      <span className="absolute top-2 start-2 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">
                        -{Math.round((1 - p.priceCents / p.oldPriceCents) * 100)}%
                      </span>
                    )}
                    {soldOut && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm font-bold text-slate-200">
                        {t("shop.soldOut")}
                      </span>
                    )}
                  </button>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A227]">{p.brand || p.category}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-100">{p.name}</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-mono text-base font-bold text-[#F2D16B]">{formatPrice(p.priceCents)}</span>
                      {p.oldPriceCents && p.oldPriceCents > p.priceCents && (
                        <span className="font-mono text-xs text-slate-500 line-through">{formatPrice(p.oldPriceCents)}</span>
                      )}
                    </div>
                    <p className={`mt-1 text-[11px] ${p.stock > 0 && p.stock <= 5 ? "text-amber-400" : "text-slate-500"}`}>
                      {soldOut ? t("shop.outOfStock") : p.stock <= 5 ? t("shop.onlyLeft", { n: p.stock }) : t("shop.inStock")}
                    </p>
                    <div className="mt-auto pt-3">
                      {inCart > 0 ? (
                        <div className="flex items-center justify-between rounded-xl border border-[#C9A227]/50 px-2 py-1.5">
                          <button onClick={() => setQty(p.id, inCart - 1)} className="cursor-pointer p-1 text-[#F2D16B]"><Minus className="h-4 w-4" /></button>
                          <span className="text-sm font-bold">{inCart}</span>
                          <button onClick={() => setQty(p.id, inCart + 1)} disabled={inCart >= p.stock} className="cursor-pointer p-1 text-[#F2D16B] disabled:opacity-30"><Plus className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <button
                          disabled={soldOut}
                          onClick={() => add(p)}
                          className="w-full cursor-pointer rounded-xl bg-[#C9A227] py-2 text-xs font-bold text-black transition hover:bg-[#E0B83A] disabled:cursor-not-allowed disabled:bg-[#2a2a2a] disabled:text-slate-500"
                        >
                          {t("shop.addToCart")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Product detail */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setDetail(null)}>
          <div className="grid w-full max-w-3xl overflow-hidden rounded-3xl border border-[#C9A227]/40 bg-[#141414] md:grid-cols-2" onClick={(e) => e.stopPropagation()}>
            <img src={detail.imageUrl} alt={detail.name} className="aspect-square h-full w-full object-cover" />
            <div className="flex flex-col p-6">
              <button onClick={() => setDetail(null)} className="ms-auto cursor-pointer text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">{detail.brand} · {t(`cat.${detail.category}`)}</p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-100">{detail.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{detail.description}</p>
              <p className="mt-4 font-mono text-2xl font-bold text-[#F2D16B]">{formatPrice(detail.priceCents)}</p>
              <p className="mt-1 text-xs text-slate-500">
                {detail.stock > 0 ? t("shop.inStockCount", { n: detail.stock }) : t("shop.outOfStock")} · {t("shop.pickupInStore")}
              </p>
              <button
                disabled={detail.stock <= 0}
                onClick={() => { add(detail); setDetail(null); }}
                className="mt-auto w-full cursor-pointer rounded-xl bg-[#C9A227] py-3 text-sm font-bold text-black hover:bg-[#E0B83A] disabled:bg-[#2a2a2a] disabled:text-slate-500"
              >
                {t("shop.addToCart")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={() => setCartOpen(false)}>
          <div className="flex h-full w-full max-w-md flex-col border-s border-[#C9A227]/30 bg-[#0F0F0F]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#2a2a2a] px-5 py-4">
              <h2 className="text-lg font-extrabold text-[#F2D16B]">
                {checkout ? t("shop.clickCollect") : t("shop.yourCart", { n: count })}
              </h2>
              <button onClick={() => { setCartOpen(false); setCheckout(false); }} className="cursor-pointer text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <ShoppingBag className="h-10 w-10 text-slate-600" />
                <p className="text-sm text-slate-400">{t("shop.emptyCart")}</p>
                <button onClick={() => setCartOpen(false)} className="cursor-pointer text-sm font-semibold text-[#F2D16B]">{t("shop.continue")}</button>
              </div>
            ) : !checkout ? (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-5">
                  {lines.map(({ product: p, qty }) => (
                    <div key={p.id} className="flex gap-3 rounded-xl border border-[#2a2a2a] bg-[#141414] p-3">
                      <img src={p.imageUrl} alt={p.name} className="h-16 w-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-100">{p.name}</p>
                        <p className="font-mono text-xs text-[#F2D16B]">{formatPrice(p.priceCents)}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <button onClick={() => setQty(p.id, qty - 1)} className="cursor-pointer rounded border border-[#3a3a3a] p-0.5"><Minus className="h-3 w-3" /></button>
                          <span className="text-xs font-bold">{qty}</span>
                          <button onClick={() => setQty(p.id, qty + 1)} disabled={qty >= p.stock} className="cursor-pointer rounded border border-[#3a3a3a] p-0.5 disabled:opacity-30"><Plus className="h-3 w-3" /></button>
                          <button onClick={() => setQty(p.id, 0)} className="ms-auto cursor-pointer text-slate-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#2a2a2a] p-5">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">{t("shop.total")}</span><span className="font-mono text-lg font-bold text-[#F2D16B]">{formatPrice(total)}</span></div>
                  <p className="mt-1 text-[11px] text-slate-500">{t("shop.payNote")}</p>
                  <button onClick={() => setCheckout(true)} className="mt-4 w-full cursor-pointer rounded-xl bg-[#C9A227] py-3 text-sm font-bold text-black hover:bg-[#E0B83A]">
                    {t("shop.reserve")}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={placeOrder} className="flex flex-1 flex-col overflow-y-auto p-5">
                <div className="mb-4 rounded-xl border border-[#C9A227]/40 bg-[#1a1505] p-3 text-xs text-slate-300">
                  <p className="font-semibold text-[#F2D16B]">{t("shop.pickupAt")} {storeAddress}</p>
                  <p className="mt-0.5">{storeHours} · {t("shop.payInStore")}</p>
                </div>
                <div className="space-y-3">
                  <input required placeholder={t("shop.fullName")} value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className={input} />
                  <input required type="tel" placeholder={t("shop.phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
                  <input type="email" placeholder={t("shop.emailOptional")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">{t("shop.preferredDay")}</label>
                    <input type="date" value={form.pickupDate} onChange={(e) => setForm({ ...form, pickupDate: e.target.value })} className={`${input} [color-scheme:dark]`} />
                  </div>
                  <textarea rows={2} placeholder={t("shop.noteOptional")} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={input} />
                </div>
                <div className="mt-4 space-y-1 border-t border-[#2a2a2a] pt-4 text-xs text-slate-400">
                  {lines.map((l) => (
                    <div key={l.product.id} className="flex justify-between"><span>{l.qty}× {l.product.name}</span><span className="font-mono">{formatPrice(l.qty * l.product.priceCents)}</span></div>
                  ))}
                  <div className="flex justify-between pt-2 text-sm"><span className="text-slate-300">{t("shop.totalPay")}</span><span className="font-mono font-bold text-[#F2D16B]">{formatPrice(total)}</span></div>
                </div>
                {error && <p className="mt-3 rounded-lg bg-red-950 px-3 py-2 text-xs text-red-300">{error}</p>}
                <div className="mt-auto flex gap-2 pt-5">
                  <button type="button" onClick={() => setCheckout(false)} className="cursor-pointer rounded-xl border border-[#3a3a3a] px-4 py-3 text-sm text-slate-300">{t("shop.back")}</button>
                  <button type="submit" disabled={submitting} className="flex-1 cursor-pointer rounded-xl bg-[#C9A227] py-3 text-sm font-bold text-black hover:bg-[#E0B83A] disabled:opacity-60">
                    {submitting ? t("shop.placing") : t("shop.placeOrder")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
