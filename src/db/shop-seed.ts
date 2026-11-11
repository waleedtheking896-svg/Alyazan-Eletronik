import { db } from "@/db";
import { products } from "@/db/schema";

const P = "/images/alyazen-phones.png";
const L = "/images/alyazen-laptops.png";
const B = "/images/alyazen-boards.png";
const A = "/images/alyazen-accessories.png";

const STARTER_PRODUCTS = [
  { name: "iPhone 15 128GB", brand: "Apple", category: "Phones", description: "6.1\" Super Retina display, A16 Bionic chip, 48MP camera, USB-C. Original with warranty.", priceCents: 79900, oldPriceCents: 84900, stock: 6, imageUrl: P, featured: true },
  { name: "Galaxy S24 256GB", brand: "Samsung", category: "Phones", description: "6.2\" Dynamic AMOLED 120Hz, Galaxy AI, 50MP triple camera.", priceCents: 74900, oldPriceCents: null, stock: 8, imageUrl: P, featured: true },
  { name: "Redmi Note 13 Pro", brand: "Xiaomi", category: "Phones", description: "200MP camera, 6.67\" AMOLED, 67W fast charging, 8GB/256GB.", priceCents: 32900, oldPriceCents: 36900, stock: 12, imageUrl: P, featured: false },
  { name: "MacBook Air M2 13\"", brand: "Apple", category: "Laptops", description: "Apple M2 chip, 8GB RAM, 256GB SSD, up to 18h battery life.", priceCents: 109900, oldPriceCents: 119900, stock: 4, imageUrl: L, featured: true },
  { name: "HP Pavilion 15", brand: "HP", category: "Laptops", description: "Intel Core i5, 16GB RAM, 512GB SSD, 15.6\" Full HD. Great for study & work.", priceCents: 64900, oldPriceCents: null, stock: 5, imageUrl: L, featured: false },
  { name: "Lenovo Legion 5 Gaming", brand: "Lenovo", category: "Laptops", description: "Ryzen 7, RTX 4060, 16GB RAM, 1TB SSD, 165Hz display.", priceCents: 129900, oldPriceCents: 139900, stock: 3, imageUrl: L, featured: true },
  { name: "Arduino Uno R3", brand: "Arduino", category: "Boards", description: "ATmega328P microcontroller board with USB cable. Perfect for beginners.", priceCents: 2490, oldPriceCents: null, stock: 40, imageUrl: B, featured: false },
  { name: "Raspberry Pi 5 (8GB)", brand: "Raspberry Pi", category: "Boards", description: "Quad-core 2.4GHz, 8GB RAM, dual 4K output, PCIe support.", priceCents: 8990, oldPriceCents: null, stock: 15, imageUrl: B, featured: true },
  { name: "ESP32 DevKit V1", brand: "Espressif", category: "Boards", description: "Wi-Fi + Bluetooth dual-core microcontroller for IoT projects.", priceCents: 990, oldPriceCents: 1290, stock: 60, imageUrl: B, featured: false },
  { name: "Sensor Starter Kit (37 pcs)", brand: "Generic", category: "Electronics", description: "37 sensors & modules: ultrasonic, temperature, motion, relay and more.", priceCents: 2990, oldPriceCents: null, stock: 20, imageUrl: B, featured: false },
  { name: "Wireless Earbuds Pro", brand: "ALYAZEN Select", category: "Accessories", description: "Active noise cancelling, 30h battery with case, Bluetooth 5.3.", priceCents: 4990, oldPriceCents: 6990, stock: 25, imageUrl: A, featured: true },
  { name: "Power Bank 20,000mAh", brand: "Anker", category: "Accessories", description: "Fast charging PD 22.5W, USB-C in/out, charges 2 devices.", priceCents: 3990, oldPriceCents: null, stock: 30, imageUrl: A, featured: false },
  { name: "65W GaN USB-C Charger", brand: "Baseus", category: "Accessories", description: "Compact 3-port charger for phones, tablets and laptops.", priceCents: 2990, oldPriceCents: null, stock: 35, imageUrl: A, featured: false },
  { name: "Smart Watch Fit 3", brand: "Huawei", category: "Electronics", description: "1.82\" AMOLED, heart rate, SpO2, GPS, 10-day battery.", priceCents: 12900, oldPriceCents: 14900, stock: 10, imageUrl: A, featured: false },
];

let pending: Promise<void> | null = null;

async function run() {
  const existing = await db.select({ id: products.id }).from(products).limit(1);
  if (existing.length > 0) return;
  await db.insert(products).values(STARTER_PRODUCTS);
}

export async function ensureProductsSeeded() {
  if (!pending) pending = run().finally(() => (pending = null));
  await pending;
}
