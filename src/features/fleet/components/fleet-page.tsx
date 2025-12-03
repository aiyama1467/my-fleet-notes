import { Fleet } from '@/features/fleet/components/fleet';
import { trpc } from '@/trpc/server';

interface FleetPageProps {
  userId: string;
}

export default async function FleetPage({ userId }: FleetPageProps) {
  const fleets = await trpc.getFleets({ userId });

  return (
    <div className="flex flex-col gap-5 w-full py-4 px-40">
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
