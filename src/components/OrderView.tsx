"use client";

import Link from "next/link";
import { CheckCircle2, Store } from "lucide-react";
import AlyazenLogo from "@/components/AlyazenLogo";
import { LanguageToggle, useLang } from "@/components/LanguageProvider";
import { formatPrice, orderNumber } from "@/lib/shop";

type Line = { id: number; productName: string; unitPriceCents: number; quantity: number };

export default function OrderView({
  order,
  items,
  storeAddress,
  storeHours,
}: {
  order: { id: number; customerName: string; phone: string; pickupDate: string; totalCents: number; status: string };
  items: Line[];
  storeAddress: string;
  storeHours: string;
}) {
  const { t } = useLang();
  const statusLabel = t(`status.${order.status}`);

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-lg rounded-3xl border border-[#C9A227]/40 bg-[#141414] p-8">
        <div className="flex justify-end">
          <LanguageToggle />
        </div>
        <div className="flex flex-col items-center text-center">
          <AlyazenLogo className="h-14 w-14" />
          <CheckCircle2 className="mt-5 h-10 w-10 text-[#C9A227]" />
          <h1 className="mt-3 text-2xl font-extrabold text-[#F2D16B]">{t("order.reserved")}</h1>
          <p className="mt-1 text-sm text-slate-400">{t("order.thanks", { name: order.customerName })}</p>
          <p className="mt-3 rounded-xl border border-[#C9A227]/50 bg-black px-5 py-2 font-mono text-2xl font-bold tracking-widest text-[#F2D16B]">
            {orderNumber(order.id)}
          </p>
          <span className="mt-3 rounded-full bg-[#1a1505] px-3 py-1 text-xs font-semibold text-[#F2D16B]">
            {t("order.status")} {statusLabel}
          </span>
        </div>

        <div className="mt-6 space-y-2 border-t border-[#2a2a2a] pt-5 text-sm">
          {items.map((it) => (
            <div key={it.id} className="flex justify-between text-slate-300">
              <span>{it.quantity}× {it.productName}</span>
              <span className="font-mono">{formatPrice(it.quantity * it.unitPriceCents)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-[#2a2a2a] pt-3 font-bold">
            <span>{t("shop.totalPay")}</span>
            <span className="font-mono text-[#F2D16B]">{formatPrice(order.totalCents)}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3 rounded-xl border border-[#2a2a2a] bg-black p-4 text-xs text-slate-300">
          <Store className="h-5 w-5 shrink-0 text-[#C9A227]" />
          <div>
            <p className="font-semibold text-slate-100">{t("order.pickupNoDelivery")}</p>
            <p className="mt-0.5">{storeAddress}</p>
            <p>{storeHours}</p>
            {order.pickupDate && <p className="mt-1 text-[#F2D16B]">{t("order.preferredDay")} {order.pickupDate}</p>}
            <p className="mt-1 text-slate-500">{t("order.willCall", { phone: order.phone })}</p>
          </div>
        </div>

        <Link href="/shop" className="mt-6 block rounded-xl bg-[#C9A227] py-3 text-center text-sm font-bold text-black hover:bg-[#E0B83A]">
          {t("order.continueShopping")}
        </Link>
      </div>
    </main>
  );
}
