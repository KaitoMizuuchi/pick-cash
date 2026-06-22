import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "../../generated/prisma/client";

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
    return this.prisma.transaction.findUnique({
      where: { id, deletedAt: null },

      select: transactionSelect,
    });
  }
}
