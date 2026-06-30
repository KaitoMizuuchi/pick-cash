import { z } from 'zod';
import { transactionTypeSchema } from './category';

export const transactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  categoryId: z.string(),
  amount: z.number().int(),
  date: z.coerce.date(),
  memo: z.string().nullable(),
  type: transactionTypeSchema,
  isFixed: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});
export type Transaction = z.infer<typeof transactionSchema>;

export const createTransactionSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.number().int().positive(),
  date: z.coerce.date(),
  memo: z.string().max(500).nullish(),
  type: transactionTypeSchema,
  isFixed: z.boolean().default(false),
});
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = createTransactionSchema.partial();
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
