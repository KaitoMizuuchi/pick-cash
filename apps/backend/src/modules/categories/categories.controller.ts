import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { GetCategoriesQueryDto } from './dto/getCategories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  // GET /categories[?type=income|expense]
  // - @Query() に DTO を指定すると、グローバル登録された ZodValidationPipe が走り、
  //   不正なクエリはここに到達する前に 400 で弾かれる。
  // - レスポンスは API 仕様（docs/apiEndpoints.md）の { data: [...] } 形式に整形する。
  //   この「レスポンス形」への詰め替えは Controller の責務に閉じる。
  @Get()
  async list(@Query() query: GetCategoriesQueryDto) {
    const data = await this.service.getAll(query.type);
    return { data };
  }
}
