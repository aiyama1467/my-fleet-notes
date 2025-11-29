import { z } from 'zod';
import { procedure, router } from '@/trpc/init';
import { getFleetsByUserId } from '../usecase/get-fleets-by-user-id';

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  getFleets: procedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(({ input }) => getFleetsByUserId(input.userId)),
});

export type AppRouter = typeof appRouter;
