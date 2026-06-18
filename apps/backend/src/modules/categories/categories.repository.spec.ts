import { describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../prisma/prisma.service';
import { CategoriesRepository } from './categories.repository';

// PrismaService のうち、Repository が利用する category.findMany だけをモックする。
// PrismaClient 全体をモックすると保守が重くなるため、必要メソッドだけ持つ最小オブジェクトを作る。
const createPrismaMock = () => ({
  category: {
    findMany: vi.fn(),
  },
});

describe('CategoriesRepository', () => {
  it('type未指定なら deletedAt: null と orderBy 付きで findMany を呼ぶ', async () => {
    const prisma = createPrismaMock();
    prisma.category.findMany.mockResolvedValue([]);
    const repo = new CategoriesRepository(prisma as unknown as PrismaService);

    await repo.findAll();

    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  });

  it('typeを指定したら where に type 条件が含まれる', async () => {
    const prisma = createPrismaMock();
    prisma.category.findMany.mockResolvedValue([]);
    const repo = new CategoriesRepository(prisma as unknown as PrismaService);

    await repo.findAll('expense');

    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null, type: 'expense' },
      orderBy: { name: 'asc' },
    });
  });

  it('findMany の戻り値をそのまま返す', async () => {
    const prisma = createPrismaMock();
    const fixture = [{ id: 'c1', name: '食費', type: 'expense' }];
    prisma.category.findMany.mockResolvedValue(fixture);
    const repo = new CategoriesRepository(prisma as unknown as PrismaService);

    const result = await repo.findAll();

    expect(result).toBe(fixture);
  });
});
