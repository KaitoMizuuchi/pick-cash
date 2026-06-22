import { Injectable } from '@nestjs/common';
import type { TransactionType } from '@pick-cash/shared';
import type { Category } from '../../generated/prisma/client';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly repository: CategoriesRepository) {}

  // 現時点ではビジネスロジックは無く Repository への素通し。
  // Controller が直接 Repository を呼ばない構造を維持しておくことで、将来「並び順をユーザー設定で
  // 変える」「使用回数の多い順に並べる」等のロジックが追加されたとき Service 内に閉じ込められる。
  async findAll(type?: TransactionType): Promise<Category[]> {
    return this.repository.findAll(type);
  }
}
