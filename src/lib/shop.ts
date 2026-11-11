// Shops in Syria commonly price electronics in US dollars.
export const CURRENCY = "$";

export function formatPrice(cents: number): string {
  return `${CURRENCY}${(cents / 100).toFixed(2)}`;
}

export function orderNumber(id: number): string {
  return `AZ-${String(id).padStart(5, "0")}`;
}

export const PRODUCT_CATEGORIES = [
  "Phones",
  "Laptops",
  "Boards",
  "Electronics",
  "Accessories",
];

export const ORDER_STATUSES = [
  "pending",
  "ready",
  "picked_up",
  "cancelled",
] as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  ready: "Ready for Pickup",
  picked_up: "Picked Up",
  cancelled: "Cancelled",
};
