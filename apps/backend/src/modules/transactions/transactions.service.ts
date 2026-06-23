import { Injectable } from "@nestjs/common";
import { TransactionsRepository } from "./transactions.repository";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@pick-cash/shared";

@Injectable()
export class TransactionsService {
  constructor(private readonly repository: TransactionsRepository) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async create(userId: string, data: CreateTransactionInput) {
    return this.repository.create(userId, data);
  }

  async update(id: string, data: UpdateTransactionInput) {
    return this.repository.update(id, data);
  }
}
