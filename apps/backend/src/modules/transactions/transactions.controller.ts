import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/createTransaction.dto";
import { UpdateTransactionDto } from "./dto/updateTransaction.dto";
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
  // 201: Createdを返すために付与する。
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() data: CreateTransactionDto) {
    return this.service.create(req.userId, data);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() data: UpdateTransactionDto) {
    return this.service.update(id, data);
  }

  @Delete(":id")
  // 204: No Contentを返すために付与する。
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    // deleteの時は204を返すためボディは空となる。そのためvoidで返すようにawaitしている。
    await this.service.remove(id);
  }
}
