import { Fleet } from '@/components/layout/fleet';
import { cookieBasedClient } from '@/lib/amplify-server-utils';

export default async function Page() {
  const { data: fleets, errors } = await cookieBasedClient.models.Fleet.list();

  if (errors) {
    console.error('Error fetching fleets:', errors);
  }

  return (
    <div className="flex flex-col gap-5 w-full py-4 px-40">
      {fleets?.map((fleet) => (
        <Fleet
          createdAt={fleet.createdAt}
          id={fleet.id}
          key={fleet.id}
          lastUpdatedAt={fleet.updatedAt}
          memo={fleet.memo}
          tags={fleet.tags || []}
          title={fleet.title}
        />
      ))}
    </div>
  );
}
