import { auth } from '@clerk/nextjs/server';

type PageProps = {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Wrapper function to protect pages requiring authentication
 * Usage: export default withAuth(async ({ userId }) => { ... })
 */
export function withAuth<T extends PageProps>(
  Component: (props: T & { userId: string }) => Promise<React.ReactElement>,
) {
  return async (props: T) => {
    const { isAuthenticated, redirectToSignIn, userId } = await auth();

    if (!isAuthenticated) {
      return redirectToSignIn();
    }

    return Component({ ...props, userId });
  };
}
