import express from 'express'
import accountRoutes from './account.routes'

export const setupAccountRoutes = () => {
  const router = express.Router();
  router.use('/accounts', accountRoutes);

  return router;
};
