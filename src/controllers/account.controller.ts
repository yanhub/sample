import { Request, Response } from 'express'
import { z } from 'zod'
import createAccountService from 'src/services/account/create-account.service'
import { TAccountPayload } from 'src/schemas/account/account-payload.schema'
import updateAccountService from 'src/services/account/update-account.service'
import getAccountsStatsService from 'src/services/account/get-accounts-stats.service'

export const createAccountHandler = async (req: Request, res: Response) => {
  try {
    const createdAccount = await createAccountService(req.body as TAccountPayload)

    return res.status(201).json(createdAccount)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateAccountHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const updatedAccount = await updateAccountService(id, req.body as TAccountPayload)

    if (!updatedAccount) {
      return res.status(404).json({ error: 'Account not found' })
    }

    return res.status(200).json(updatedAccount)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getAccountsStatsHandler = async (req: Request, res: Response) => {
  try {
    const result = await getAccountsStatsService()

    return res.status(200).json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}
