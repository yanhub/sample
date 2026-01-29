import { z } from 'zod';
import { BaseSchema } from 'src/schemas/base.schema'
import { AccountPayloadSchema } from 'src/schemas/account/account-payload.schema'

export const AccountSchema = AccountPayloadSchema
  .extend({
    // some feature fields
  })
  .merge(BaseSchema)
  .strict();

export type TAccount = z.infer<typeof AccountSchema>;
