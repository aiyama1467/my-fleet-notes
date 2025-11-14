# Next.js 16 ベストプラクティス

このドキュメントは、Next.js 16の最新のベストプラクティスをまとめたものです。

## 目次

- [自動最適化](#自動最適化)
- [開発中のベストプラクティス](#開発中のベストプラクティス)
- [本番環境への移行前](#本番環境への移行前)
- [Next.js 16の主要な変更点](#nextjs-16の主要な変更点)
- [Cache Componentsの活用](#cache-componentsの活用)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [セキュリティ](#セキュリティ)

## 自動最適化

Next.js 16では、以下の最適化がデフォルトで有効になっています：

### Server Components
- デフォルトでServer Componentsを使用
- サーバー側で実行され、クライアント側のJavaScriptバンドルサイズに影響しない
- インタラクティブな機能が必要な場合のみClient Componentsを使用

### コード分割
- ルートセグメント単位で自動的にコード分割
- 必要に応じてClient Componentsとサードパーティライブラリを遅延読み込み

### プリフェッチング
- リンクがビューポートに入ると、Next.jsがバックグラウンドでルートをプリフェッチ
- ほぼ瞬時のナビゲーションを実現

### 静的レンダリング
- ビルド時にServerとClient Componentsを静的にレンダリング
- 結果をキャッシュしてパフォーマンスを向上
- 必要に応じて動的レンダリングを選択可能

### キャッシング
- データリクエスト、レンダリング結果、静的アセットなどを広範囲にキャッシュ
- サーバー、データベース、バックエンドサービスへのネットワークリクエストを削減

## 開発中のベストプラクティス

### ルーティングとレンダリング

#### Layoutsの使用
```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
```

- ページ間でUIを共有
- ナビゲーション時の部分的レンダリングを有効化

#### Link Componentの使用
```tsx
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  )
}
```

- クライアント側のナビゲーションとプリフェッチングを実現

#### エラーハンドリング
```tsx
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={() => reset()}>再試行</button>
    </div>
  )
}
```

- カスタムエラーページで包括的なエラーと404エラーを処理

#### Client/Server Componentsの適切な構成
```tsx
// Server Component (デフォルト)
async function ServerComponent() {
  const data = await fetchData()
  return <div>{data}</div>
}

// Client Component
'use client'

import { useState } from 'react'

function ClientComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**重要なパターン：**
- Client Componentをツリーの下層に配置
- `"use client"`境界を最小限に抑える
- クライアント側のJavaScriptバンドルを不必要に増やさない

#### 動的APIの使用
```tsx
import { cookies } from 'next/headers'
import { Suspense } from 'react'

async function UserComponent() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  return <div>ユーザーセッション: {session}</div>
}

export default function Page() {
  return (
    <div>
      <h1>静的コンテンツ</h1>
      <Suspense fallback={<div>読み込み中...</div>}>
        <UserComponent />
      </Suspense>
    </div>
  )
}
```

- `cookies`、`headers`、`searchParams`などの動的APIは全体のルートを動的レンダリングにする
- 適切な場所で`<Suspense>`境界でラップする

### データフェッチングとキャッシング

#### Server Componentsでのデータフェッチ
```tsx
async function ProductList() {
  const products = await fetch('https://api.example.com/products')
    .then(res => res.json())
  
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

#### Route Handlersの使用
```tsx
// app/api/data/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const data = await fetchDataFromBackend()
  return NextResponse.json(data)
}
```

- Server ComponentsからRoute Handlersを呼び出さない（余分なサーバーリクエストを避ける）

#### ストリーミング
```tsx
// app/loading.tsx
export default function Loading() {
  return <div>読み込み中...</div>
}
```

- Loading UIとReact Suspenseを使用して、段階的にUIを送信

#### 並列データフェッチング
```tsx
async function Page() {
  // 並列でデータをフェッチ
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts()
  ])
  
  return (
    <div>
      <User data={user} />
      <Posts data={posts} />
    </div>
  )
}
```

#### データキャッシング
```tsx
// キャッシュされたfetch
const data = await fetch('https://api.example.com/data', {
  cache: 'force-cache' // デフォルト
})

// キャッシュなし
const freshData = await fetch('https://api.example.com/data', {
  cache: 'no-store'
})

// 時間ベースのキャッシュ
const revalidatedData = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 } // 1時間
})
```

### UIとアクセシビリティ

#### フォームとバリデーション
```tsx
// app/actions.ts
'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  
  // バリデーション
  if (!name || !email) {
    return { error: 'すべてのフィールドを入力してください' }
  }
  
  // データベース処理
  await db.users.create({ name, email })
  return { success: true }
}
```

```tsx
// app/form.tsx
'use client'

import { createUser } from './actions'

export default function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" placeholder="名前" />
      <input name="email" type="email" placeholder="メール" />
      <button type="submit">送信</button>
    </form>
  )
}
```

#### グローバルエラーUI
```tsx
// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>予期しないエラーが発生しました</h2>
        <button onClick={() => reset()}>再試行</button>
      </body>
    </html>
  )
}
```

#### フォント最適化
```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

#### 画像最適化
```tsx
import Image from 'next/image'

export default function Avatar() {
  return (
    <Image
      src="/avatar.jpg"
      alt="ユーザーアバター"
      width={100}
      height={100}
      priority // LCPイメージの場合
    />
  )
}
```

#### リモート画像パターンの設定
```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        pathname: '/my-bucket/**',
      },
    ],
  },
}

export default nextConfig
```

#### スクリプトの最適化
```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        strategy="lazyOnload"
      />
    </>
  )
}
```

### セキュリティ

#### データテイント
```tsx
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    taint: true,
  },
}

export default nextConfig
```

#### Server Actions
```tsx
'use server'

import { cookies } from 'next/headers'

export async function updateProfile(formData: FormData) {
  // 認証チェック
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  
  if (!session) {
    throw new Error('認証が必要です')
  }
  
  // データ更新処理
  // ...
}
```

#### 環境変数
```bash
# .env.local
DATABASE_URL="postgresql://..."  # サーバー側のみ
NEXT_PUBLIC_API_URL="https://api.example.com"  # クライアント側でも利用可能
```

```tsx
// Server Component
async function ServerComponent() {
  // サーバー側でのみアクセス可能
  const dbUrl = process.env.DATABASE_URL
  // ...
}

// Client Component
'use client'

function ClientComponent() {
  // クライアント側でアクセス可能
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  // ...
}
```

#### Content Security Policy
```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### メタデータとSEO

#### Metadata API
```tsx
// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ホームページ',
  description: 'Next.js 16のベストプラクティス',
  openGraph: {
    title: 'ホームページ',
    description: 'Next.js 16のベストプラクティス',
    images: ['/og-image.jpg'],
  },
}

export default function Page() {
  return <h1>ホームページ</h1>
}
```

#### 動的メタデータ
```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  
  return {
    title: post.title,
    description: post.excerpt,
  }
}
```

#### サイトマップとRobots
```tsx
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://example.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
```

```tsx
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

## 本番環境への移行前

### ビルドとテスト
```bash
# ローカルでビルド
npm run build

# 本番モードで起動
npm run start
```

### Core Web Vitals

#### useReportWebVitals
```tsx
// app/layout.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
    // アナリティクスに送信
  })
}
```

### バンドル分析

#### @next/bundle-analyzer
```bash
npm install @next/bundle-analyzer
```

```ts
// next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer({
  // Next.js設定
})
```

```bash
# バンドル分析を実行
ANALYZE=true npm run build
```

## Next.js 16の主要な変更点

### Turbopackがデフォルト

Next.js 16では、Turbopackがデフォルトのバンドラーとなりました：

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

#### Turbopack設定の移動
```ts
// next.config.ts (Next.js 16)
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    // Turbopackオプション
  },
}

export default nextConfig
```

#### Webpackへのオプトアウト
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build --webpack"
  }
}
```

### 非同期リクエストAPI（破壊的変更）

Next.js 16では、以下のAPIが完全に非同期になりました：

```tsx
import { cookies, headers } from 'next/headers'

export default async function Page() {
  // 非同期でアクセス
  const cookieStore = await cookies()
  const headersList = await headers()
  
  return <div>...</div>
}
```

#### 非同期パラメータ
```tsx
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const query = await searchParams
  
  return <div>...</div>
}
```

### React 19.2

Next.js 16はReact 19.2を使用：

#### View Transitions
```tsx
import { useTransition } from 'react'

function Component() {
  const [isPending, startTransition] = useTransition()
  
  const handleClick = () => {
    startTransition(() => {
      // 状態更新
    })
  }
  
  return <button onClick={handleClick}>クリック</button>
}
```

### React Compiler サポート

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
}

export default nextConfig
```

```bash
# React Compilerプラグインのインストール
npm install -D babel-plugin-react-compiler
```

### キャッシングAPI

#### revalidateTag
```ts
// app/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function updateArticle(articleId: string) {
  await db.articles.update(articleId)
  
  // 記事データを古いものとしてマーク
  revalidateTag(`article-${articleId}`, 'max')
}
```

#### updateTag（新API）
```ts
// app/actions.ts
'use server'

import { updateTag } from 'next/cache'

export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile)
  
  // キャッシュを期限切れにして即座にリフレッシュ
  updateTag(`user-${userId}`)
}
```

#### refresh（新API）
```ts
// app/actions.ts
'use server'

import { refresh } from 'next/cache'

export async function markNotificationAsRead(notificationId: string) {
  await db.notifications.markAsRead(notificationId)
  
  // クライアントルーターをリフレッシュ
  refresh()
}
```

#### cacheLifeとcacheTag（安定版）
```ts
// 以前
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache'

// Next.js 16
import { cacheLife, cacheTag } from 'next/cache'
```

### Partial Pre-Rendering (PPR)

Next.js 16では、PPRは`cacheComponents`フラグで有効化されます：

```js
// next.config.js
module.exports = {
  cacheComponents: true,
}
```

### middlewareからproxyへ

```bash
# ファイル名を変更
mv middleware.ts proxy.ts
```

```ts
// proxy.ts
export function proxy(request: Request) {
  // プロキシロジック
}
```

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  skipProxyUrlNormalize: true,
}

export default nextConfig
```

### next/imageの変更

#### ローカル画像のクエリ文字列
```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '?v=1',
      },
    ],
  },
}

export default nextConfig
```

#### minimumCacheTTLのデフォルト値
```ts
// next.config.ts（以前の動作に戻す場合）
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60, // デフォルトは14400（4時間）
  },
}

export default nextConfig
```

#### imageSizesのデフォルト値
```ts
// next.config.ts（16pxをサポートする場合）
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

export default nextConfig
```

#### qualitiesのデフォルト値
```ts
// next.config.ts（複数の品質をサポートする場合）
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    qualities: [50, 75, 100],
  },
}

export default nextConfig
```

#### ローカルIP制限
```ts
// next.config.ts（プライベートネットワークのみ）
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
  },
}

export default nextConfig
```

### Parallel Routesのdefault.js要件

すべてのParallel Routeスロットに明示的な`default.js`ファイルが必要になりました：

```tsx
// app/@modal/default.tsx
import { notFound } from 'next/navigation'

export default function Default() {
  notFound()
}
```

または：

```tsx
// app/@modal/default.tsx
export default function Default() {
  return null
}
```

### ESLint Flat Config

```bash
# コードモッドでマイグレーション
npx @next/codemod@canary next-lint-to-eslint-cli .
```

### 削除された機能

#### AMP サポート
- `amp`設定
- `next/amp`フック
- AMPページ設定

#### next lintコマンド
- BiomeまたはESLintを直接使用

#### Runtime Configuration
```tsx
// 以前（Next.js 15）
import getConfig from 'next/config'

export default function Page() {
  const { publicRuntimeConfig } = getConfig()
  return <p>API URL: {publicRuntimeConfig.apiUrl}</p>
}

// 現在（Next.js 16） - 環境変数を使用
'use client'

export default function ClientComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return <p>API URL: {apiUrl}</p>
}
```

## Cache Componentsの活用

Cache Componentsは、Next.js 16の新しいレンダリングとキャッシング方式です。

### 概念

#### デフォルトで動的
- すべてのルートはデフォルトで動的
- 最新のデータで各リクエストをレンダリング

#### 細かい制御
- `use cache`でキャッシュ可能な部分をマーク
- 静的部分と一緒にプリレンダリングパスに含める

### 使い方

#### 1. ランタイムデータ用のSuspense

ランタイムAPIを使用するコンポーネントを`Suspense`でラップ：

```tsx
import { cookies } from 'next/headers'
import { Suspense } from 'react'

async function User() {
  const session = (await cookies()).get('session')?.value
  return <div>セッション: {session}</div>
}

export default function Page() {
  return (
    <section>
      <h1>これはプリレンダリングされます</h1>
      <Suspense fallback={<div>読み込み中...</div>}>
        <User />
      </Suspense>
    </section>
  )
}
```

**ランタイムAPI:**
- `cookies()`
- `headers()`
- `searchParams`プロップ
- `params`プロップ（`generateStaticParams`なしの場合）

#### 2. 動的データ用のSuspense

動的データ（fetch、データベースクエリなど）を使用するコンポーネントをラップ：

```tsx
import { Suspense } from 'react'

async function DynamicContent() {
  const res = await fetch('http://api.cms.com/posts')
  const { posts } = await res.json()
  return <div>{/* posts表示 */}</div>
}

export default function Page() {
  return (
    <>
      <h1>これはプリレンダリングされます</h1>
      <Suspense fallback={<div>スケルトン</div>}>
        <DynamicContent />
      </Suspense>
    </>
  )
}
```

**動的データパターン:**
- `fetch()`リクエスト
- データベースクエリ
- `connection()`

#### 3. use cacheでキャッシュ

Server Componentに`use cache`を追加してプリレンダリングシェルに含める：

```tsx
import { cacheLife } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheLife('hours')
  
  const data = await db.query('SELECT * FROM products')
  return data
}
```

### use cacheの詳細

#### 基本的な使い方
```tsx
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')
  
  const data = await fetch('https://api.example.com/data')
  return <div>{/* データ表示 */}</div>
}
```

#### タグと再検証

##### updateTagの使用
```tsx
import { cacheTag, updateTag } from 'next/cache'

export async function getCart() {
  'use cache'
  cacheTag('cart')
  // データフェッチ
}

export async function updateCart(itemId: string) {
  'use server'
  // itemIdを使用してデータを書き込む
  updateTag('cart')
}
```

##### revalidateTagの使用
```tsx
import { cacheTag, revalidateTag } from 'next/cache'

export async function getPosts() {
  'use cache'
  cacheTag('posts')
  // データフェッチ
}

export async function createPost(post: FormData) {
  'use server'
  // FormDataを使用してデータを書き込む
  revalidateTag('posts', 'max')
}
```

### Cache Componentsを有効化

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

### ルートセグメント設定への影響

#### dynamic = "force-dynamic"
```tsx
// 以前 - 不要
export const dynamic = 'force-dynamic'

// 現在 - 削除するだけ（デフォルトで動的）
export default function Page() {
  return <div>...</div>
}
```

#### dynamic = "force-static"
```tsx
// 以前
export const dynamic = 'force-static'

export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>...</div>
}

// 現在
export default async function Page() {
  'use cache'
  const data = await fetch('https://api.example.com/data')
  return <div>...</div>
}
```

#### revalidate
```tsx
// 以前
export const revalidate = 3600

// 現在
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')
  return <div>...</div>
}
```

### Route Handlersとの併用

```tsx
// app/api/products/route.ts
import { cacheLife } from 'next/cache'

export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}

async function getProducts() {
  'use cache'
  cacheLife('hours')
  
  return await db.query('SELECT * FROM products')
}
```

## パフォーマンス最適化

### ルーティングとナビゲーションの強化

Next.js 16では、ルーティングシステムが完全に見直されました：

- **レイアウトの重複排除**: 複数のURLをプリフェッチする際、共有レイアウトは1回だけダウンロード
- **増分プリフェッチング**: キャッシュにない部分のみをプリフェッチ

### ターミナル出力の改善

- より明確なフォーマット
- より良いエラーメッセージ
- パフォーマンスメトリクスの改善

### ビルド出力からのメトリクス削除

`next build`出力から`size`と`First Load JS`メトリクスが削除されました：

- Chrome LighthouseまたはVercel Analyticsを使用
- Core Web Vitalsに焦点を当てる

### 開発サーバーの設定読み込み

`next dev`コマンドは設定ファイルを1回だけ読み込むようになりました：

```js
// next.config.js
import { startServer } from 'docs-lib/dev-server'

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  startServer()
}

const nextConfig = {
  /* 設定オプション */
}

module.exports = nextConfig
```

## セキュリティ

### データテイント

機密データがクライアントに公開されることを防ぐ：

```tsx
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    taint: true,
  },
}

export default nextConfig
```

### Server Actionsのセキュリティ

```tsx
'use server'

import { cookies } from 'next/headers'

export async function sensitiveAction() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  // 認証されたアクションを実行
}
```

### データのサニタイズ

```ts
// lib/data.ts
export async function getUser(slug: string) {
  const [rows] = await sql`SELECT * FROM user WHERE slug = ${slug}`
  const user = rows[0]
  
  // 公開フィールドのみを返す
  return {
    name: user.name,
    avatar: user.avatar,
  }
}
```

### Content Security Policy

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## まとめ

Next.js 16のベストプラクティス：

1. **Server Componentsをデフォルトで使用** - クライアント側のJavaScriptを最小限に
2. **Cache Componentsを活用** - 細かいキャッシング制御でパフォーマンス向上
3. **適切なSuspense境界** - ストリーミングとユーザー体験の改善
4. **非同期APIへの対応** - すべての動的APIを非同期で処理
5. **セキュリティ重視** - データテイント、適切な環境変数管理
6. **メタデータ最適化** - SEOとソーシャル共有の改善
7. **パフォーマンス監視** - Core Web Vitalsとアナリティクスツールの活用

これらのベストプラクティスに従うことで、高速で安全、かつスケーラブルなNext.js 16アプリケーションを構築できます。
