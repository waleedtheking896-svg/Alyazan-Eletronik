import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const businessProfile = pgTable("business_profile", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  tagline: text("tagline").notNull(),
  industry: text("industry").notNull(),
  heroEyebrow: text("hero_eyebrow").notNull(),
  heroHeadline: text("hero_headline").notNull(),
  heroSubheadline: text("hero_subheadline").notNull(),
  heroCtaPrimary: text("hero_cta_primary").notNull(),
  heroCtaSecondary: text("hero_cta_secondary").notNull(),
  heroImageUrl: text("hero_image_url").notNull(),
  aboutHeading: text("about_heading").notNull(),
  aboutBody: text("about_body").notNull(),
  accentColor: text("accent_color").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  hours: text("hours").notNull(),
  instagramUrl: text("instagram_url").default("").notNull(),
  facebookUrl: text("facebook_url").default("").notNull(),
  heroEyebrowAr: text("hero_eyebrow_ar").default("").notNull(),
  heroHeadlineAr: text("hero_headline_ar").default("").notNull(),
  heroSubheadlineAr: text("hero_subheadline_ar").default("").notNull(),
  heroCtaSecondaryAr: text("hero_cta_secondary_ar").default("").notNull(),
  aboutHeadingAr: text("about_heading_ar").default("").notNull(),
  aboutBodyAr: text("about_body_ar").default("").notNull(),
  stat1Value: text("stat1_value").notNull(),
  stat1Label: text("stat1_label").notNull(),
  stat2Value: text("stat2_value").notNull(),
  stat2Label: text("stat2_label").notNull(),
  stat3Value: text("stat3_value").notNull(),
  stat3Label: text("stat3_label").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  priceLabel: text("price_label").notNull(),
  turnaround: text("turnaround").notNull(),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  clientName: text("client_name").notNull(),
  category: text("category").notNull(),
  summary: text("summary").notNull(),
  metricLabel: text("metric_label").notNull(),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role").notNull(),
  quote: text("quote").notNull(),
  rating: integer("rating").default(5).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").default("").notNull(),
  company: text("company").default("").notNull(),
  serviceInterest: text("service_interest").notNull(),
  budgetRange: text("budget_range").default("").notNull(),
  preferredDate: text("preferred_date").default("").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").default("").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  priceCents: integer("price_cents").notNull(),
  oldPriceCents: integer("old_price_cents"),
  stock: integer("stock").default(0).notNull(),
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").default("").notNull(),
  note: text("note").default("").notNull(),
  pickupDate: text("pickup_date").default("").notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id"),
  productName: text("product_name").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  quantity: integer("quantity").notNull(),
});

export type ProductItem = typeof products.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;

// Single-row table that stores the admin password hash (id is always 1).
export const adminSettings = pgTable("admin_settings", {
  id: integer("id").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type BusinessProfile = typeof businessProfile.$inferSelect;
export type ServiceItem = typeof services.$inferSelect;
export type ProjectItem = typeof projects.$inferSelect;
export type TestimonialItem = typeof testimonials.$inferSelect;
export type InquiryItem = typeof inquiries.$inferSelect;
export type SubscriberItem = typeof subscribers.$inferSelect;
