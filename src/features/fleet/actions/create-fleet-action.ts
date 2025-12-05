// src/features/fleet/actions/create-fleet-action.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { createFleet } from '../server/create-fleet';

export async function createFleetAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const memo = formData.get('memo') as string;

  await createFleet({
    userId,
    title,
    tags: [],
    memo: memo || '',
  });

  revalidatePath('/fleets'); // キャッシュを無効化
}
