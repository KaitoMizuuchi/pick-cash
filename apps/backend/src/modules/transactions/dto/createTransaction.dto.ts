import { createTransactionSchema } from "@pick-cash/shared";
import { createZodDto } from "nestjs-zod";

export class CreateTransactionDto extends createZodDto(
  createTransactionSchema,
) {}
