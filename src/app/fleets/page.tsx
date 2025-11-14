import { Fleet } from '@/components/layout/fleet';

// メモっぽいサンプルデータ
const fleets = [
  {
    id: 1,
    title: '買い物リスト',
    tags: ['買い物', '食材'],
    memo: '牛乳、卵、パン、バナナ\nあとトイレットペーパーも忘れずに',
    createdAt: '2025-11-10',
    lastUpdatedAt: '2025-11-14',
  },
  {
    id: 2,
    title: '週末やること',
    tags: ['TODO', '家事'],
    memo: '・部屋の掃除\n・洗濯\n・本の返却（図書館）\n・友達に連絡する',
    createdAt: '2025-11-12',
    lastUpdatedAt: '2025-11-15',
  },
  {
    id: 3,
    title: 'プロジェクトアイデア',
    tags: ['開発', 'アイデア'],
    memo: 'Next.js + Supabaseでタスク管理アプリ作りたい\n認証とリアルタイム同期を実装してみる',
    createdAt: '2025-11-08',
    lastUpdatedAt: '2025-11-13',
  },
  {
    id: 4,
    title: '読みたい本',
    tags: ['本', '趣味'],
    memo: '・クリーンアーキテクチャ\n・ドメイン駆動設計入門\n・リーダブルコード（再読）',
    createdAt: '2025-11-05',
    lastUpdatedAt: '2025-11-11',
  },
  {
    id: 5,
    title: '旅行メモ',
    tags: ['旅行', 'プラン'],
    memo: '12月に京都行きたい\n紅葉の時期は混むから平日がいいかも\n宿泊先調べる',
    createdAt: '2025-11-01',
    lastUpdatedAt: '2025-11-09',
  },
  {
    id: 6,
    title: '映画リスト',
    tags: ['映画', 'エンタメ'],
    memo: '見たい：インセプション、インターステラー\n見た：オッペンハイマー（★★★★☆）',
    createdAt: '2025-10-28',
    lastUpdatedAt: '2025-11-07',
  },
  {
    id: 7,
    title: '勉強メモ - TypeScript',
    tags: ['学習', '技術'],
    memo: 'Genericsの使い方がやっと理解できた！\n次はConditional Typesを勉強する',
    createdAt: '2025-10-25',
    lastUpdatedAt: '2025-11-06',
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-5 w-full py-4 px-40">
      {fleets.map((fleet) => (
        <Fleet key={fleet.id} {...fleet} />
      ))}
    </div>
  );
}
