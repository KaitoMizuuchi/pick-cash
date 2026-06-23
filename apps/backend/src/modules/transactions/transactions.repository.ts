import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "../../generated/prisma/client";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@pick-cash/shared";

// カテゴリーとユーザーはともにnameだけ返す。idはmapのkeyで使用する。
const transactionSelect = {
  id: true,
  amount: true,
  date: true,
  memo: true,
  type: true,
  isFixed: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.TransactionSelect;

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.transaction.findMany({
      where: {
        deletedAt: null,
      },

      select: transactionSelect,

      orderBy: {
        date: "desc",
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.transaction.findUniqueOrThrow({
      where: { id, deletedAt: null },

      select: transactionSelect,
    });
  }

  async create(userId: string, data: CreateTransactionInput) {
    return this.prisma.transaction.create({
      data: {
        userId: userId,
        ...data,
      },

      select: transactionSelect,
    });
  }

  async update(id: string, data: UpdateTransactionInput) {
    return this.prisma.transaction.update({
      where: { id, deletedAt: null },
      data: {
        ...data,
      },

      select: transactionSelect,
    });
  }

  async remove(id: string) {
    return this.prisma.transaction.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
