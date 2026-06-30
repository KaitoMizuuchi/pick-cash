import { Injectable } from '@nestjs/common';
import type { CreateTransactionInput, UpdateTransactionInput } from '@pick-cash/shared';
import { TransactionsRepository } from './transactions.repository';

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

  async remove(id: string) {
    return this.repository.remove(id);
  }
}
