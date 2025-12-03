import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Fleet } from '@/features/fleet/components/fleet';
import { trpc } from '@/trpc/server';
import CreateFleetModal from './create-fleet-modal';
import { FleetListSkeleton } from './fleet-skeleton';

interface FleetPageProps {
  userId: string;
}

async function FleetList({ userId }: { userId: string }) {
  const fleets = await trpc.getFleets({ userId });

  return (
    <div className="flex flex-col gap-5">
      {fleets?.map((fleet) => (
        <Fleet
          createdAt={fleet.createdAt.toISOString()}
          id={fleet.id}
          key={fleet.id}
          lastUpdatedAt={fleet.updatedAt.toISOString()}
          memo={fleet.memo}
          tags={fleet.tags || []}
          title={fleet.title}
        />
      ))}
    </div>
  );
}

export default function FleetPage({ userId }: FleetPageProps) {
  return (
    <div className="flex flex-col w-full py-4 px-40">
      <div className="flex items-center justify-between mb-5">
        <form action="#" className="w-full max-w-xs">
          <Input aria-label="Search" placeholder="Search..." />
        </form>
        <CreateFleetModal trigger={<Button size="sm">New Fleet</Button>} />
      </div>
      <Suspense fallback={<FleetListSkeleton />}>
        <FleetList userId={userId} />
      </Suspense>
    </div>
  );
}
