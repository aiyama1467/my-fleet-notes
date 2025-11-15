import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  const { isAuthenticated, redirectToSignIn, userId } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  return (
    <div className="p-4">
      <p>hello {userId}</p>
    </div>
  );
}
