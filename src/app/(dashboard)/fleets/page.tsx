import FleetPage from '@/features/fleet/components/fleet-page';
import { withAuth } from '@/lib/auth';

export default withAuth(async ({ userId }) => {
  return <FleetPage userId={userId} />;
});
