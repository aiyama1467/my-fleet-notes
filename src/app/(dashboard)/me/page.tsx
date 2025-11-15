import { withAuth } from '@/lib/auth';

export default withAuth(async ({ userId }) => {
  return (
    <div className="p-4">
      <p>hello {userId}</p>
    </div>
  );
});
