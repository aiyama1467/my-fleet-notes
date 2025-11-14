import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import config from '../../amplify_outputs.json';

Amplify.configure(config);

// API Key認証を使用してシード
const client = generateClient<Schema>({
  authMode: 'apiKey',
});

const fleetData = [
  {
    title: '週末の買い物リスト',
    tags: ['買い物', '週末', '食品'],
    memo: '牛乳、卵、パン、野菜を買う。スーパーのセールをチェックすること。',
  },
  {
    title: 'プロジェクトのアイデア',
    tags: ['仕事', 'プロジェクト', 'アイデア'],
    memo: 'Next.js 16でダッシュボードアプリを作成。Cache Componentsを活用してパフォーマンス最適化を検討。',
  },
  {
    title: '読書メモ: Clean Code',
    tags: ['読書', '技術書', 'プログラミング'],
    memo: '関数は小さく保つ。1つの関数は1つのことだけを行う。変数名は意図を明確に。',
  },
  {
    title: '健康管理の目標',
    tags: ['健康', '運動', '習慣'],
    memo: '毎朝30分のウォーキング。水を1日2リットル飲む。22時までに就寝。',
  },
  {
    title: '旅行の計画',
    tags: ['旅行', '計画', '休暇'],
    memo: '京都への3日間の旅行。清水寺、金閣寺、嵐山を訪問予定。宿泊先を予約すること。',
  },
  {
    title: '英語学習のメモ',
    tags: ['学習', '英語', '語学'],
    memo: '毎日30分のリスニング練習。Duolingoでレッスン。英語のポッドキャストを聞く。',
  },
  {
    title: '料理レシピ: カレー',
    tags: ['料理', 'レシピ', '夕食'],
    memo: '玉ねぎ2個、じゃがいも3個、人参1本、カレールー。弱火で30分煮込む。',
  },
  {
    title: '誕生日プレゼントのアイデア',
    tags: ['プレゼント', '誕生日', '家族'],
    memo: '母の誕生日プレゼント候補: 花束、スカーフ、お菓子の詰め合わせ。予算1万円。',
  },
  {
    title: '映画鑑賞リスト',
    tags: ['映画', 'エンターテイメント', '趣味'],
    memo: '見たい映画: インセプション、インターステラー、ショーシャンクの空に。週末に鑑賞予定。',
  },
  {
    title: '車のメンテナンス',
    tags: ['車', 'メンテナンス', '予定'],
    memo: 'オイル交換: 来月15日。タイヤの空気圧チェック。バッテリーの状態確認。',
  },
];

async function seedFleets() {
  try {
    console.log('🌱 Fleetデータのシード開始...');

    for (const fleet of fleetData) {
      const result = await client.models.Fleet.create(fleet);
      if (result.data) {
        console.log(`✅ 作成: ${fleet.title}`);
      } else if (result.errors) {
        console.error(`❌ エラー (${fleet.title}):`, result.errors);
      }
    }

    console.log('🎉 シード完了！');
  } catch (error) {
    console.error('❌ シード中にエラーが発生:', error);
    throw error;
  }
}

seedFleets();
