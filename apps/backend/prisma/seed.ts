// biome-ignore-all lint/suspicious/noConsole: seedスクリプトは進捗ログを標準出力に出す前提
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, TransactionType } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const SEED_USER = {
  id: 'seed_user_dev',
  email: 'dev@pick-cash.local',
  name: '開発ユーザー',
};

const SEED_CATEGORIES: Array<{ id: string; name: string; type: TransactionType }> = [
  // 支出
  { id: 'seed_cat_food', name: '食費', type: TransactionType.expense },
  { id: 'seed_cat_transport', name: '交通費', type: TransactionType.expense },
  { id: 'seed_cat_housing', name: '住居費', type: TransactionType.expense },
  { id: 'seed_cat_utilities', name: '光熱費', type: TransactionType.expense },
  { id: 'seed_cat_communication', name: '通信費', type: TransactionType.expense },
  { id: 'seed_cat_entertainment', name: '娯楽費', type: TransactionType.expense },
  { id: 'seed_cat_medical', name: '医療費', type: TransactionType.expense },
  { id: 'seed_cat_clothing', name: '衣服費', type: TransactionType.expense },
  { id: 'seed_cat_other_expense', name: 'その他', type: TransactionType.expense },
  // 収入
  { id: 'seed_cat_salary', name: '給与', type: TransactionType.income },
  { id: 'seed_cat_bonus', name: '賞与', type: TransactionType.income },
  { id: 'seed_cat_side_job', name: '副業', type: TransactionType.income },
  { id: 'seed_cat_other_income', name: 'その他', type: TransactionType.income },
];

// 開発用の取引データ。id を固定値にすることで upsert の冪等性を担保する。
// 日付は実装時点（2026-06）の月内に揃え、固定費 / 変動費 / 収入をひと月分カバーできる構成。
const SEED_TRANSACTIONS: Array<{
  id: string;
  categoryId: string;
  amount: number;
  date: Date;
  memo: string | null;
  type: TransactionType;
  isFixed: boolean;
}> = [
  // 固定費
  {
    id: 'seed_tx_rent_202606',
    categoryId: 'seed_cat_housing',
    amount: 85000,
    date: new Date('2026-06-01'),
    memo: '家賃 6月分',
    type: TransactionType.expense,
    isFixed: true,
  },
  {
    id: 'seed_tx_utilities_202606',
    categoryId: 'seed_cat_utilities',
    amount: 12000,
    date: new Date('2026-06-05'),
    memo: '電気・ガス・水道',
    type: TransactionType.expense,
    isFixed: true,
  },
  {
    id: 'seed_tx_internet_202606',
    categoryId: 'seed_cat_communication',
    amount: 5500,
    date: new Date('2026-06-10'),
    memo: 'ネット + 携帯',
    type: TransactionType.expense,
    isFixed: true,
  },
  // 変動費
  {
    id: 'seed_tx_lunch_20260603',
    categoryId: 'seed_cat_food',
    amount: 950,
    date: new Date('2026-06-03'),
    memo: 'ランチ',
    type: TransactionType.expense,
    isFixed: false,
  },
  {
    id: 'seed_tx_supermarket_20260607',
    categoryId: 'seed_cat_food',
    amount: 3200,
    date: new Date('2026-06-07'),
    memo: 'スーパー買い出し',
    type: TransactionType.expense,
    isFixed: false,
  },
  {
    id: 'seed_tx_train_20260605',
    categoryId: 'seed_cat_transport',
    amount: 420,
    date: new Date('2026-06-05'),
    memo: '電車',
    type: TransactionType.expense,
    isFixed: false,
  },
  {
    id: 'seed_tx_movie_20260612',
    categoryId: 'seed_cat_entertainment',
    amount: 1800,
    date: new Date('2026-06-12'),
    memo: '映画',
    type: TransactionType.expense,
    isFixed: false,
  },
  {
    id: 'seed_tx_clinic_20260615',
    categoryId: 'seed_cat_medical',
    amount: 1500,
    date: new Date('2026-06-15'),
    memo: null,
    type: TransactionType.expense,
    isFixed: false,
  },
  // 収入
  {
    id: 'seed_tx_salary_202606',
    categoryId: 'seed_cat_salary',
    amount: 280000,
    date: new Date('2026-06-25'),
    memo: '6月給与',
    type: TransactionType.income,
    isFixed: true,
  },
  {
    id: 'seed_tx_side_20260618',
    categoryId: 'seed_cat_side_job',
    amount: 15000,
    date: new Date('2026-06-18'),
    memo: '副業案件',
    type: TransactionType.income,
    isFixed: false,
  },
];

async function main() {
  console.log('Seeding User...');
  await prisma.user.upsert({
    where: { id: SEED_USER.id },
    create: SEED_USER,
    update: { email: SEED_USER.email, name: SEED_USER.name },
  });

  console.log(`Seeding ${SEED_CATEGORIES.length} categories...`);
  for (const category of SEED_CATEGORIES) {
    await prisma.category.upsert({
      where: { id: category.id },
      create: category,
      update: { name: category.name, type: category.type },
    });
  }

  console.log(`Seeding ${SEED_TRANSACTIONS.length} transactions...`);
  for (const tx of SEED_TRANSACTIONS) {
    await prisma.transaction.upsert({
      where: { id: tx.id },
      create: {
        ...tx,
        userId: SEED_USER.id,
      },
      // 既存レコードがあれば再投入時に最新値で上書きし、deletedAt も解除する（再シード時に
      // 一度削除済みになっていても元に戻すため）。
      update: {
        categoryId: tx.categoryId,
        amount: tx.amount,
        date: tx.date,
        memo: tx.memo,
        type: tx.type,
        isFixed: tx.isFixed,
        deletedAt: null,
      },
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
