import { withAuth } from '@/lib/auth';
import { trpc } from '@/trpc/server';

export default withAuth(async ({ userId }) => {
  const { greeting } = await trpc.hello({ text: userId });

  return (
    <div className="p-4">
      <p>{greeting}</p>
    </div>
  );
});
