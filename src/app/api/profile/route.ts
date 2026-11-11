import { NextResponse } from "next/server";
import { db } from "@/db";
import { businessProfile } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db.select().from(businessProfile).limit(1);
    return NextResponse.json({ profile: rows[0] ?? null });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json();

    const rows = await db.select().from(businessProfile).limit(1);
    const current = rows[0];
    if (!current) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 }
      );
    }

    const str = (val: unknown, fallback: string) =>
      typeof val === "string" && val.trim().length > 0 ? val.trim() : fallback;

    const updatedValues = {
      businessName: str(body.businessName, current.businessName),
      tagline: str(body.tagline, current.tagline),
      industry: str(body.industry, current.industry),
      heroEyebrow: str(body.heroEyebrow, current.heroEyebrow),
      heroHeadline: str(body.heroHeadline, current.heroHeadline),
      heroSubheadline: str(body.heroSubheadline, current.heroSubheadline),
      heroCtaPrimary: str(body.heroCtaPrimary, current.heroCtaPrimary),
      heroCtaSecondary: str(body.heroCtaSecondary, current.heroCtaSecondary),
      heroImageUrl: str(body.heroImageUrl, current.heroImageUrl),
      aboutHeading: str(body.aboutHeading, current.aboutHeading),
      aboutBody: str(body.aboutBody, current.aboutBody),
      accentColor: str(body.accentColor, current.accentColor),
      email: str(body.email, current.email),
      phone: str(body.phone, current.phone),
      address: str(body.address, current.address),
      hours: str(body.hours, current.hours),
      instagramUrl: typeof body.instagramUrl === "string" ? body.instagramUrl.trim() : current.instagramUrl,
      facebookUrl: typeof body.facebookUrl === "string" ? body.facebookUrl.trim() : current.facebookUrl,
      stat1Value: str(body.stat1Value, current.stat1Value),
      stat1Label: str(body.stat1Label, current.stat1Label),
      stat2Value: str(body.stat2Value, current.stat2Value),
      stat2Label: str(body.stat2Label, current.stat2Label),
      stat3Value: str(body.stat3Value, current.stat3Value),
      stat3Label: str(body.stat3Label, current.stat3Label),
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(businessProfile)
      .set(updatedValues)
      .where(eq(businessProfile.id, current.id))
      .returning();

    return NextResponse.json({ profile: updated });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json(
      { error: "Failed to update business profile" },
      { status: 500 }
    );
  }
}
