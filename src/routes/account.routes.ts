import express from 'express';
import { validateRequestBodyMiddleware } from 'src/middlewares/validate-request-body.middleware'
import { AccountPayloadSchema } from 'src/schemas/account/account-payload.schema'
import {
  createAccountHandler,
  getAccountsStatsHandler,
  updateAccountHandler
} from 'src/controllers/account.controller'

const router = express.Router();

router.post('/', validateRequestBodyMiddleware(AccountPayloadSchema), createAccountHandler);
router.put('/:id', validateRequestBodyMiddleware(AccountPayloadSchema), updateAccountHandler);
router.get('/stats', getAccountsStatsHandler);

export default router;
