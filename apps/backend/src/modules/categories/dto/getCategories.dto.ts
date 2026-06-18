import { transactionTypeSchema } from '@pick-cash/shared';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// クエリパラメータのバリデーションスキーマ。
// - type: 種別フィルタ。未指定なら全件取得とする。
// - shared の transactionTypeSchema を再利用し、許容値（income / expense）の定義を一箇所に集約する。
const getCategoriesQuerySchema = z.object({
  type: transactionTypeSchema.optional(),
});

// createZodDto: Zodスキーマを NestJS の @Query() / @Body() で受け取れるクラスに変換する。
// この DTO を受け取る Controller のハンドラに到達した時点で、値はバリデーション済み・型推論済みとなる。
export class GetCategoriesQueryDto extends createZodDto(getCategoriesQuerySchema) {}
