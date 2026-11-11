import { db } from "@/db";
import { ensureSchema } from "@/db/bootstrap";
import {
  businessProfile,
  inquiries,
  projects,
  services,
  testimonials,
} from "@/db/schema";
import { getPresetByKey } from "@/lib/presets";
import { asc } from "drizzle-orm";

let seedPromise: Promise<void> | null = null;

async function runInitialSeed() {
  const existingProfiles = await db.select().from(businessProfile).limit(1);
  if (existingProfiles.length > 0) {
    return;
  }

  const defaultPreset = getPresetByKey("electronics");

  await db.transaction(async (tx) => {
    const checkAgain = await tx.select().from(businessProfile).limit(1);
    if (checkAgain.length > 0) return;

    await tx.insert(businessProfile).values(defaultPreset.profile);

    await tx.insert(services).values(defaultPreset.services);
    await tx.insert(projects).values(defaultPreset.projects);
    await tx.insert(testimonials).values(defaultPreset.testimonials);

    const existingInquiries = await tx.select().from(inquiries).limit(1);
    if (existingInquiries.length === 0) {
      await tx.insert(inquiries).values([
        {
          fullName: "Jordan Mitchell",
          email: "jordan@meridianhome.co",
          phone: "(415) 701-2298",
          company: "Meridian Home Goods",
          serviceInterest: "Flagship Website & Funnel Build",
          budgetRange: "$5,000 – $10,000",
          preferredDate: "Next Tuesday morning",
          message:
            "Looking to refresh our brand website and add an interactive wholesale order request flow before Q3 launch.",
          status: "new",
        },
        {
          fullName: "Sophia Chen",
          email: "sophia@novaclinic.org",
          phone: "(650) 412-9031",
          company: "Nova Wellness Studio",
          serviceInterest: "Complete Brand Identity System",
          budgetRange: "$2,500 – $5,000",
          preferredDate: "This Friday afternoon",
          message:
            "Opening our second flagship location and need refreshed signage, packaging, and booking web presence.",
          status: "booked",
        },
      ]);
    }
  });
}

export async function ensureSeeded() {
  await ensureSchema();
  if (!seedPromise) {
    seedPromise = runInitialSeed().finally(() => {
      seedPromise = null;
    });
  }
  await seedPromise;
}

export async function applyPresetToDatabase(presetKey: string) {
  const preset = getPresetByKey(presetKey);

  await db.transaction(async (tx) => {
    const existing = await tx.select().from(businessProfile).limit(1);
    if (existing.length > 0) {
      await tx.delete(businessProfile);
    }
    await tx.insert(businessProfile).values(preset.profile);

    await tx.delete(services);
    await tx.insert(services).values(preset.services);

    await tx.delete(projects);
    await tx.insert(projects).values(preset.projects);

    await tx.delete(testimonials);
    await tx.insert(testimonials).values(preset.testimonials);
  });

  return getFullSiteData();
}

export async function getFullSiteData() {
  await ensureSeeded();

  const [profileRows, serviceRows, projectRows, testimonialRows] =
    await Promise.all([
      db.select().from(businessProfile).limit(1),
      db
        .select()
        .from(services)
        .orderBy(asc(services.sortOrder), asc(services.id)),
      db
        .select()
        .from(projects)
        .orderBy(asc(projects.sortOrder), asc(projects.id)),
      db.select().from(testimonials).orderBy(asc(testimonials.id)),
    ]);

  return {
    profile: profileRows[0],
    services: serviceRows,
    projects: projectRows,
    testimonials: testimonialRows,
  };
}
