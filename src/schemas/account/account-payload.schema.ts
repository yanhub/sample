import { z } from 'zod';
import { AccountScopesEnum } from 'src/types/enums/account-scopes.enum'

export const AccountPayloadSchema = z.object({
  name: z.string(),
  scope: z.nativeEnum(AccountScopesEnum),
}).strict();

export type TAccountPayload = z.infer<typeof AccountPayloadSchema>;
