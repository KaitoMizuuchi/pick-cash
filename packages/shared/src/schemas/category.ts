import { z } from 'zod';

export const transactionTypeSchema = z.enum(['income', 'expense']);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: transactionTypeSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});
export type Category = z.infer<typeof categorySchema>;
