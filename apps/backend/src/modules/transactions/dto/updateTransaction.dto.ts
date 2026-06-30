import { updateTransactionSchema } from '@pick-cash/shared';
import { createZodDto } from 'nestjs-zod';

export class UpdateTransactionDto extends createZodDto(updateTransactionSchema) {}
