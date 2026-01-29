import { getAccountStats } from 'src/repositories/account.repository'

const getAccountsStatsService = async (): Promise<{
  accounts: number;
  prospects: number;
  children: number;
}> => {
  return getAccountStats();
};

export default getAccountsStatsService;
