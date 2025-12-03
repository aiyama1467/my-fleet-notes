import { desc, eq } from 'drizzle-orm';
import { fleets } from '@/db/schema';
import { db } from '@/lib/db-connection';

export async function getFleetsByUserId(userId: string) {
  return await db
    .select()
    .from(fleets)
    .where(eq(fleets.userId, userId))
    .orderBy(desc(fleets.updatedAt));
}
