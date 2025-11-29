import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

const CONNECTION_STRING = process.env.DATABASE_URL;
if (!CONNECTION_STRING) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// グローバル変数を使用してシングルトンパターンを実装
declare global {
  var __db: ReturnType<typeof drizzle> | undefined;
  var __client: ReturnType<typeof postgres> | undefined;
}

let client: ReturnType<typeof postgres>;
let db: ReturnType<typeof drizzle>;

if (process.env.NODE_ENV === 'production') {
  client = postgres(CONNECTION_STRING);
  db = drizzle(client, { schema });
} else {
  // 開発環境ではグローバル変数を使用して接続を再利用
  if (!global.__client) {
    global.__client = postgres(CONNECTION_STRING);
  }
  if (!global.__db) {
    global.__db = drizzle(global.__client, { schema });
  }
  client = global.__client;
  db = global.__db;
}

export { db, client };
