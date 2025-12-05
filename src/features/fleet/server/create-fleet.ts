import { ulid } from 'ulid';
import { fleets } from '@/db/schema';
import { db } from '@/lib/db-connection';

interface CreateFleetParams {
  userId: string;
  title: string;
  tags: string[];
  memo: string;
}

export async function createFleet({
  userId,
  title,
  tags,
  memo,
}: CreateFleetParams) {
  await db.insert(fleets).values({ id: ulid(), userId, title, tags, memo });
}
