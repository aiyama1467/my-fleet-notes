import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { cookies } from 'next/headers';
import type { Schema } from '../../amplify/data/resource';
import config from '../../amplify_outputs.json';

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config,
  cookies,
  authMode: 'apiKey',
});
