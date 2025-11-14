import { a, type ClientSchema, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Fleet: a
    .model({
      title: a.string().required(),
      tags: a.string().array(),
      memo: a.string().required(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow
        .publicApiKey()
        .to(['read', 'create']), // シード用
    ]),
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 7, // 短期間のみ
    },
  },
});
