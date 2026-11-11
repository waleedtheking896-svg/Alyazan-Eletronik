CREATE TABLE "admin_settings" (
	"id" integer PRIMARY KEY NOT NULL,
	"password_hash" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_name" text NOT NULL,
	"tagline" text NOT NULL,
	"industry" text NOT NULL,
	"hero_eyebrow" text NOT NULL,
	"hero_headline" text NOT NULL,
	"hero_subheadline" text NOT NULL,
	"hero_cta_primary" text NOT NULL,
	"hero_cta_secondary" text NOT NULL,
	"hero_image_url" text NOT NULL,
	"about_heading" text NOT NULL,
	"about_body" text NOT NULL,
	"accent_color" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"hours" text NOT NULL,
	"instagram_url" text DEFAULT '' NOT NULL,
	"facebook_url" text DEFAULT '' NOT NULL,
	"hero_eyebrow_ar" text DEFAULT '' NOT NULL,
	"hero_headline_ar" text DEFAULT '' NOT NULL,
	"hero_subheadline_ar" text DEFAULT '' NOT NULL,
	"hero_cta_secondary_ar" text DEFAULT '' NOT NULL,
	"about_heading_ar" text DEFAULT '' NOT NULL,
	"about_body_ar" text DEFAULT '' NOT NULL,
	"stat1_value" text NOT NULL,
	"stat1_label" text NOT NULL,
	"stat2_value" text NOT NULL,
	"stat2_label" text NOT NULL,
	"stat3_value" text NOT NULL,
	"stat3_label" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"company" text DEFAULT '' NOT NULL,
	"service_interest" text NOT NULL,
	"budget_range" text DEFAULT '' NOT NULL,
	"preferred_date" text DEFAULT '' NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer,
	"product_name" text NOT NULL,
	"unit_price_cents" integer NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"pickup_date" text DEFAULT '' NOT NULL,
	"total_cents" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brand" text DEFAULT '' NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"price_cents" integer NOT NULL,
	"old_price_cents" integer,
	"stock" integer DEFAULT 0 NOT NULL,
	"image_url" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"client_name" text NOT NULL,
	"category" text NOT NULL,
	"summary" text NOT NULL,
	"metric_label" text NOT NULL,
	"image_url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"price_label" text NOT NULL,
	"turnaround" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_name" text NOT NULL,
	"author_role" text NOT NULL,
	"quote" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;