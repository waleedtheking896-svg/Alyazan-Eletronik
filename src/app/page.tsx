import type { Metadata } from "next";
import { getFullSiteData } from "@/db/seed";
import BusinessSiteClient from "@/components/BusinessSiteClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { profile } = await getFullSiteData();
    if (profile) {
      return {
        title: `${profile.businessName} — ${profile.tagline}`,
        description: profile.heroSubheadline,
      };
    }
  } catch {
    // Fallback metadata during build or before DB push
  }

  return {
    title: "Vanguard & Co. — Modern Business Website",
    description:
      "Full-stack modern business showcase, services, portfolio, and client inquiry booking.",
  };
}

export default async function HomePage() {
  const { profile, services, projects, testimonials } =
    await getFullSiteData();

  return (
    <BusinessSiteClient
      initialProfile={profile}
      initialServices={services}
      initialProjects={projects}
      initialTestimonials={testimonials}
    />
  );
}
