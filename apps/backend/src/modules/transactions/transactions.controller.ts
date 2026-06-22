import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/createTransaction.dto";
import type { Request } from "express";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return { data };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Req() req: Request, @Body() data: CreateTransactionDto) {
    return this.service.create(req.userId, data);
  }
}
