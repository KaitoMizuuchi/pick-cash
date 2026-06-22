import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // カテゴリーとユーザーはともにnameだけ返す。idはmapのkeyで使用する
  async findAll() {
    return this.prisma.transaction.findMany({
      select: {
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
      },

      where: {
        deletedAt: null,
      },

      orderBy: {
        date: "desc",
      },
    });
  }
}
