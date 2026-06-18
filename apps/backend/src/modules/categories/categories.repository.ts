import { Injectable } from '@nestjs/common';
import type { TransactionType } from '@pick-cash/shared';
import type { Category } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 論理削除されていないカテゴリのみを返す。
  // - deletedAt: null フィルタを Repository 層で強制することで、Service / Controller が
  //   論理削除済みのレコードを誤って参照する事故を防ぐ（docs/architecture.md / CLAUDE.md 方針）。
  // - type 未指定なら全件、指定があれば income / expense で絞り込む。
  async findAll(type?: TransactionType): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        deletedAt: null,
        ...(type ? { type } : {}),
      },
      orderBy: { name: 'asc' },
    });
  }
}
