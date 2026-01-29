import { TAccount } from 'src/schemas/account/account.schema'
import { update } from 'src/repositories/account.repository'
import { TAccountPayload } from 'src/schemas/account/account-payload.schema'

const updateAccountService = async (
  id: string,
  data: TAccountPayload
): Promise<TAccount> => {
  return update(id, data);
};

export default updateAccountService;
