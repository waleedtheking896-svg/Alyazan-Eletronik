import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const list = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.createdAt));
    return NextResponse.json({ subscribers: list });
  } catch (error) {
    console.error("GET /api/subscribers error:", error);
    return NextResponse.json(
      { error: "Failed to load subscribers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email));

    if (existing.length > 0) {
      return NextResponse.json({
        subscriber: existing[0],
        alreadySubscribed: true,
      });
    }

    const [created] = await db
      .insert(subscribers)
      .values({ email })
      .returning();

    return NextResponse.json(
      { subscriber: created, alreadySubscribed: false },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/subscribers error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
