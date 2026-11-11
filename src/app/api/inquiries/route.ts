import { NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeded();
    const list = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt), desc(inquiries.id));
    return NextResponse.json({ inquiries: list });
  } catch (error) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to load inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json();

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const serviceInterest =
      typeof body.serviceInterest === "string" && body.serviceInterest.trim()
        ? body.serviceInterest.trim()
        : "General Consultation";
    const budgetRange =
      typeof body.budgetRange === "string" ? body.budgetRange.trim() : "";
    const preferredDate =
      typeof body.preferredDate === "string" ? body.preferredDate.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in your name, email, and project details." },
        { status: 400 }
      );
    }

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(inquiries)
      .values({
        fullName,
        email,
        phone,
        company,
        serviceInterest,
        budgetRange,
        preferredDate,
        message,
        status: "new",
      })
      .returning();

    return NextResponse.json({ inquiry: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
