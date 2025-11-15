import { Fleet } from '@/components/layout/fleet';
import { Skeleton } from '@/components/ui/skeleton';

const fleetsData = [
  {
    id: '1',
    title: '週末の買い物リスト',
    tags: ['買い物', '週末', '食品'],
    memo: '牛乳、卵、パン、野菜を買う。スーパーのセールをチェックすること。',
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    id: '2',
    title: 'プロジェクトのアイデア',
    tags: ['仕事', 'プロジェクト', 'アイデア'],
    memo: 'Next.js 16でダッシュボードアプリを作成。Cache Componentsを活用してパフォーマンス最適化を検討。',
    createdAt: '2024-06-02T09:00:00Z',
    updatedAt: '2024-06-02T11:00:00Z',
  },
  {
    id: '3',
    title: '読書メモ: Clean Code',
    tags: ['読書', '技術書', 'プログラミング'],
    memo: '関数は小さく保つ。1つの関数は1つのことだけを行う。変数名は意図を明確に。',
    createdAt: '2024-06-03T08:00:00Z',
    updatedAt: '2024-06-03T10:00:00Z',
  },
  {
    id: '4',
    title: '健康管理の目標',
    tags: ['健康', '運動', '習慣'],
    memo: '毎朝30分のウォーキング。水を1日2リットル飲む。22時までに就寝。',
    createdAt: '2024-06-04T06:00:00Z',
    updatedAt: '2024-06-04T08:00:00Z',
  },
  {
    id: '5',
    title: '旅行の計画',
    tags: ['旅行', '計画', '休暇'],
    memo: '京都への3日間の旅行。清水寺、金閣寺、嵐山を訪問予定。宿泊先を予約すること。',
    createdAt: '2024-06-04T07:00:00Z',
    updatedAt: '2024-06-04T09:00:00Z',
  },
];

export default async function Page() {
  const fleets = await new Promise<typeof fleetsData>((resolve) =>
    setTimeout(() => {
      resolve(fleetsData);
    }, 1000),
  );

  return (
    <div className="flex flex-col gap-5 w-full py-4 px-40">
      {fleets?.map((fleet) => (
        <Fleet
          createdAt={fleet.createdAt}
          id={fleet.id}
          key={fleet.id}
          lastUpdatedAt={fleet.updatedAt}
          memo={fleet.memo}
          tags={fleet.tags || []}
          title={fleet.title}
        />
      ))}
    </div>
  );
}
