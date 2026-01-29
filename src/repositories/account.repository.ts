import { Collection, ObjectId, WithId } from 'mongodb';
import { getDB } from 'src/db/connection'
import { TAccount } from 'src/schemas/account/account.schema'
import { AccountScopesEnum } from 'src/types/enums/account-scopes.enum'
import { TAccountPayload } from 'src/schemas/account/account-payload.schema'
import { z } from 'zod'

export const ACCOUNTS_COLLECTION = 'Accounts';

const getCollection = (): Collection<TAccount> => {
  return getDB().collection<TAccount>(ACCOUNTS_COLLECTION);
};

export const createAccount = async (
  payload: TAccountPayload
): Promise<WithId<TAccount>> => {
  const { updatedAt, ...safePayload } = payload as TAccountPayload & { updatedAt?: unknown };

  const _id = new ObjectId();
  const insertDoc: WithId<TAccount> = {
    _id,
    ...safePayload,
    createdAt: new Date(),
  };

  z
    .object({ updatedAt: z.undefined() })
    .parse({ updatedAt: (insertDoc as { updatedAt?: unknown }).updatedAt });

  const collection = getCollection();
  const result = await collection.findOneAndUpdate(
    { _id },
    { $setOnInsert: insertDoc },
    { upsert: true, returnDocument: 'after', includeResultMetadata: true }
  );

  if (!result.value) {
    throw new Error('Failed to create account');
  }

  return result.value as WithId<TAccount>;
};

export const update = async (
  id: string,
  payload: TAccountPayload
): Promise<WithId<TAccount>> => {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ID');
  }

  const { createdAt, ...safePayload } = payload as TAccountPayload & { createdAt?: unknown };

  const updateDoc: Omit<TAccount, 'createdAt'> = {
    ...safePayload,
    updatedAt: new Date(),
  };

  z
    .object({ createdAt: z.undefined() })
    .parse({ createdAt: (updateDoc as { createdAt?: unknown }).createdAt });

  const collection = getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateDoc },
    { returnDocument: 'after', includeResultMetadata: true }
  );

  if (!result.value) {
    throw new Error('Account not found');
  }

  return result.value as WithId<TAccount>;
};

export const getAccountStats = async (): Promise<{
  accounts: number;
  prospects: number;
  children: number;
}> => {
  const collection = getCollection();

  type ScopeCount = { _id: AccountScopesEnum; count: number };
  const stats = await collection
    .aggregate<ScopeCount>([
      {
        $group: {
          _id: '$scope',
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const initial = {
    accounts: 0,
    prospects: 0,
    children: 0,
  };

  const scopeToKey: Record<AccountScopesEnum, keyof typeof initial> = {
    [AccountScopesEnum.ACCOUNT]: 'accounts',
    [AccountScopesEnum.PROSPECT]: 'prospects',
    [AccountScopesEnum.CHILD]: 'children',
  };

  return stats.reduce((acc, { _id, count }) => {
    acc[scopeToKey[_id]] = count;
    return acc;
  }, { ...initial });
};
