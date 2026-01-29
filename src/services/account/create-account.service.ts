import { TAccount } from 'src/schemas/account/account.schema'
import { createAccount } from 'src/repositories/account.repository'
import { TAccountPayload } from 'src/schemas/account/account-payload.schema'

const createAccountService = async (
  data: TAccountPayload
): Promise<TAccount> => {
  return createAccount(data);
};

export default createAccountService;
