import { Controller, Get } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  async list() {
    const data = await this.service.getAll();
    return { data };
  }
}
