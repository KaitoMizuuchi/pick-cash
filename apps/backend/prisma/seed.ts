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
