import { Fleet } from '@/components/layout/fleet';
import { withAuth } from '@/lib/auth';
import { trpc } from '@/trpc/server';

export default withAuth(async ({ userId }) => {
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
});
