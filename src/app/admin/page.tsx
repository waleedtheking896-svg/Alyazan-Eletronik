import type { Metadata } from "next";
import { db } from "@/db";
import { inquiries, subscribers } from "@/db/schema";
import { getFullSiteData } from "@/db/seed";
import { desc } from "drizzle-orm";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Owner Portal & Site Studio",
  description: "Manage your business website, services, showcase, and leads.",
};

export default async function AdminPage() {
  const [{ profile, services, projects, testimonials }, inquiryRows, subRows] =
    await Promise.all([
      getFullSiteData(),
      db
        .select()
        .from(inquiries)
        .orderBy(desc(inquiries.createdAt), desc(inquiries.id)),
      db.select().from(subscribers).orderBy(desc(subscribers.createdAt)),
    ]);

  return (
    <AdminDashboardClient
      initialProfile={profile}
      initialServices={services}
      initialProjects={projects}
      initialTestimonials={testimonials}
      initialInquiries={inquiryRows}
      initialSubscribers={subRows}
    />
  );
}
