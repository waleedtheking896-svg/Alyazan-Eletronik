import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminSettings } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { ensureSchema } from "@/db/bootstrap";

// Starting password, used only the first time (when the database has no password yet).
const START_PASSWORD = "Alyazen2026";

/** Returns the stored password hash. Creates the row with the starting password if it does not exist yet. */
export async function getPasswordHash(): Promise<string> {
  await ensureSchema();
  const [row] = await db.select().from(adminSettings).where(eq(adminSettings.id, 1));
  if (row) return row.passwordHash;

  await db
    .insert(adminSettings)
    .values({ id: 1, passwordHash: hashPassword(START_PASSWORD) })
    .onConflictDoNothing();

  const [created] = await db.select().from(adminSettings).where(eq(adminSettings.id, 1));
  return created.passwordHash;
}

export async function setPasswordHash(newHash: string): Promise<void> {
  await db
    .insert(adminSettings)
    .values({ id: 1, passwordHash: newHash, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: adminSettings.id,
      set: { passwordHash: newHash, updatedAt: new Date() },
    });
}
