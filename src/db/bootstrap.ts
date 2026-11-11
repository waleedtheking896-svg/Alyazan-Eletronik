import { pool } from "@/db";

/**
 * Creates the database tables on first run (idempotent).
 * This lets a fresh hosting deployment work without running drizzle-kit manually.
 * Generated from drizzle/0000_init.sql.
 */
const STATEMENTS: string[] = [
  "CREATE TABLE \"admin_settings\" (\n\t\"id\" integer PRIMARY KEY NOT NULL,\n\t\"password_hash\" text NOT NULL,\n\t\"updated_at\" timestamp DEFAULT now() NOT NULL\n);",
  "CREATE TABLE \"business_profile\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"business_name\" text NOT NULL,\n\t\"tagline\" text NOT NULL,\n\t\"industry\" text NOT NULL,\n\t\"hero_eyebrow\" text NOT NULL,\n\t\"hero_headline\" text NOT NULL,\n\t\"hero_subheadline\" text NOT NULL,\n\t\"hero_cta_primary\" text NOT NULL,\n\t\"hero_cta_secondary\" text NOT NULL,\n\t\"hero_image_url\" text NOT NULL,\n\t\"about_heading\" text NOT NULL,\n\t\"about_body\" text NOT NULL,\n\t\"accent_color\" text NOT NULL,\n\t\"email\" text NOT NULL,\n\t\"phone\" text NOT NULL,\n\t\"address\" text NOT NULL,\n\t\"hours\" text NOT NULL,\n\t\"instagram_url\" text DEFAULT '' NOT NULL,\n\t\"facebook_url\" text DEFAULT '' NOT NULL,\n\t\"hero_eyebrow_ar\" text DEFAULT '' NOT NULL,\n\t\"hero_headline_ar\" text DEFAULT '' NOT NULL,\n\t\"hero_subheadline_ar\" text DEFAULT '' NOT NULL,\n\t\"hero_cta_secondary_ar\" text DEFAULT '' NOT NULL,\n\t\"about_heading_ar\" text DEFAULT '' NOT NULL,\n\t\"about_body_ar\" text DEFAULT '' NOT NULL,\n\t\"stat1_value\" text NOT NULL,\n\t\"stat1_label\" text NOT NULL,\n\t\"stat2_value\" text NOT NULL,\n\t\"stat2_label\" text NOT NULL,\n\t\"stat3_value\" text NOT NULL,\n\t\"stat3_label\" text NOT NULL,\n\t\"updated_at\" timestamp DEFAULT now() NOT NULL\n);",
  "CREATE TABLE \"inquiries\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"full_name\" text NOT NULL,\n\t\"email\" text NOT NULL,\n\t\"phone\" text DEFAULT '' NOT NULL,\n\t\"company\" text DEFAULT '' NOT NULL,\n\t\"service_interest\" text NOT NULL,\n\t\"budget_range\" text DEFAULT '' NOT NULL,\n\t\"preferred_date\" text DEFAULT '' NOT NULL,\n\t\"message\" text NOT NULL,\n\t\"status\" text DEFAULT 'new' NOT NULL,\n\t\"created_at\" timestamp DEFAULT now() NOT NULL\n);",
  "CREATE TABLE \"order_items\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"order_id\" integer NOT NULL,\n\t\"product_id\" integer,\n\t\"product_name\" text NOT NULL,\n\t\"unit_price_cents\" integer NOT NULL,\n\t\"quantity\" integer NOT NULL\n);",
  "CREATE TABLE \"orders\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"customer_name\" text NOT NULL,\n\t\"phone\" text NOT NULL,\n\t\"email\" text DEFAULT '' NOT NULL,\n\t\"note\" text DEFAULT '' NOT NULL,\n\t\"pickup_date\" text DEFAULT '' NOT NULL,\n\t\"total_cents\" integer NOT NULL,\n\t\"status\" text DEFAULT 'pending' NOT NULL,\n\t\"created_at\" timestamp DEFAULT now() NOT NULL\n);",
  "CREATE TABLE \"products\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"name\" text NOT NULL,\n\t\"brand\" text DEFAULT '' NOT NULL,\n\t\"category\" text NOT NULL,\n\t\"description\" text NOT NULL,\n\t\"price_cents\" integer NOT NULL,\n\t\"old_price_cents\" integer,\n\t\"stock\" integer DEFAULT 0 NOT NULL,\n\t\"image_url\" text NOT NULL,\n\t\"featured\" boolean DEFAULT false NOT NULL,\n\t\"active\" boolean DEFAULT true NOT NULL,\n\t\"created_at\" timestamp DEFAULT now() NOT NULL\n);",
  "CREATE TABLE \"projects\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"title\" text NOT NULL,\n\t\"client_name\" text NOT NULL,\n\t\"category\" text NOT NULL,\n\t\"summary\" text NOT NULL,\n\t\"metric_label\" text NOT NULL,\n\t\"image_url\" text NOT NULL,\n\t\"sort_order\" integer DEFAULT 0 NOT NULL,\n\t\"created_at\" timestamp DEFAULT now() NOT NULL\n);",
  "CREATE TABLE \"services\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"title\" text NOT NULL,\n\t\"category\" text NOT NULL,\n\t\"description\" text NOT NULL,\n\t\"price_label\" text NOT NULL,\n\t\"turnaround\" text NOT NULL,\n\t\"featured\" boolean DEFAULT false NOT NULL,\n\t\"sort_order\" integer DEFAULT 0 NOT NULL,\n\t\"created_at\" timestamp DEFAULT now() NOT NULL\n);",
  "CREATE TABLE \"subscribers\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"email\" text NOT NULL,\n\t\"created_at\" timestamp DEFAULT now() NOT NULL,\n\tCONSTRAINT \"subscribers_email_unique\" UNIQUE(\"email\")\n);",
  "CREATE TABLE \"testimonials\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"author_name\" text NOT NULL,\n\t\"author_role\" text NOT NULL,\n\t\"quote\" text NOT NULL,\n\t\"rating\" integer DEFAULT 5 NOT NULL,\n\t\"created_at\" timestamp DEFAULT now() NOT NULL\n);",
  "ALTER TABLE \"order_items\" ADD CONSTRAINT \"order_items_order_id_orders_id_fk\" FOREIGN KEY (\"order_id\") REFERENCES \"public\".\"orders\"(\"id\") ON DELETE cascade ON UPDATE no action;"
];

let ready: Promise<void> | null = null;

async function run(): Promise<void> {
  for (const statement of STATEMENTS) {
    try {
      await pool.query(statement);
    } catch (error) {
      const code = (error as { code?: string }).code;
      // 42P07 = table already exists, 42710 = object (e.g. constraint) already exists
      if (code === "42P07" || code === "42710") continue;
      throw error;
    }
  }
}

export function ensureSchema(): Promise<void> {
  if (!ready) {
    ready = run().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}
