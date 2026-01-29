import { z } from 'zod';

export const BaseSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
