import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { ulid } from 'ulid';
import { fleets } from '../../src/db/schema';

const DATABASE_URL = process.env.DATABASE_URL;
const SEED_USER_ID = process.env.SEED_USER_ID;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}
if (!SEED_USER_ID) {
  throw new Error('SEED_USER_ID is not defined in environment variables');
}

// データベース接続
const client = postgres(DATABASE_URL);
const db = drizzle(client);

// サンプルデータ
const sampleFleets = [
  {
    id: ulid(),
    userId: SEED_USER_ID,
    title: 'Next.js 16の新機能について',
    tags: ['nextjs', 'react', 'web'],
    memo: 'Next.js 16ではTurbopackがデフォルトになり、Cache Componentsが導入された。非同期リクエストAPIも完全に非同期になったので注意が必要。',
  },
  {
    id: ulid(),
    userId: SEED_USER_ID,
    title: 'Drizzle ORMのベストプラクティス',
    tags: ['drizzle', 'database', 'typescript'],
    memo: 'Drizzle ORMは型安全性が高く、パフォーマンスも優れている。マイグレーション管理も簡単で、PostgreSQL、MySQL、SQLiteに対応している。',
  },
  {
    id: ulid(),
    userId: SEED_USER_ID,
    title: 'Server ComponentsとClient Componentsの使い分け',
    tags: ['nextjs', 'react', 'architecture'],
    memo: 'Server Componentsをデフォルトで使用し、インタラクティブな機能が必要な場合のみClient Componentsを使用する。"use client"境界を最小限に抑えることが重要。',
  },
  {
    id: ulid(),
    userId: SEED_USER_ID,
    title: 'Cache Componentsの活用方法',
    tags: ['nextjs', 'cache', 'performance'],
    memo: '"use cache"ディレクティブとcacheLife()を使用して細かいキャッシング制御を実現。updateTag()やrevalidateTag()でキャッシュの無効化も可能。',
  },
  {
    id: ulid(),
    userId: SEED_USER_ID,
    title: 'TypeScriptの型安全性を活かす',
    tags: ['typescript', 'type-safety', 'development'],
    memo: 'InferSelectModelとInferInsertModelを使用してデータベーススキーマから型を自動生成。これにより、型の整合性が保たれる。',
  },
  {
    id: ulid(),
    userId: SEED_USER_ID,
    title: 'Tailwind CSSのユーティリティクラス',
    tags: ['tailwind', 'css', 'styling'],
    memo: 'Tailwind CSSのユーティリティファーストアプローチにより、高速に美しいUIを構築できる。カスタムデザインシステムの構築も容易。',
  },
  {
    id: ulid(),
    userId: SEED_USER_ID,
    title: 'パフォーマンス最適化のポイント',
    tags: ['performance', 'optimization', 'web'],
    memo: 'Core Web Vitalsを重視し、画像最適化、コード分割、プリフェッチングを活用する。Suspense境界で適切にストリーミングを実装することも重要。',
  },
  {
    id: ulid(),
    userId: SEED_USER_ID,
    title: 'セキュリティベストプラクティス',
    tags: ['security', 'best-practice', 'web'],
    memo: 'データテイント、環境変数の適切な管理、Content Security Policyの設定が重要。Server Actionsでは必ず認証チェックを実施する。',
  },
  {
    id: ulid(),
    userId: SEED_USER_ID,
    title: 'React 19の新機能',
    tags: ['react', 'javascript', 'framework'],
    memo: 'React 19ではView Transitions、useTransition、Server Actionsなどの新機能が追加された。Next.js 16はReact 19.2をサポートしている。',
  },
  {
    id: ulid(),
    userId: SEED_USER_ID,
    title: 'データベース設計の基本',
    tags: ['database', 'design', 'architecture'],
    memo: '正規化、インデックス設計、リレーション設計が重要。パフォーマンスとメンテナンス性のバランスを考慮する必要がある。',
  },
];

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // 既存のデータをクリア
    console.log('🗑️  Clearing existing data...');
    await db.delete(fleets);

    // サンプルデータを挿入
    console.log('📝 Inserting sample data...');
    await db.insert(fleets).values(sampleFleets);

    console.log(`✅ Successfully seeded ${sampleFleets.length} fleets`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    // データベース接続を閉じる
    await client.end();
  }
}

// スクリプト実行
seed()
  .then(() => {
    console.log('🎉 Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });
