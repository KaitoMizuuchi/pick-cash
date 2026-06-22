import { Injectable } from "@nestjs/common";
import { TransactionsRepository } from "./transactions.repository";

@Injectable()
export class TransactionsService {
  constructor(private readonly repository: TransactionsRepository) {}

  async getAll() {
    return this.repository.findAll();
  }
}
