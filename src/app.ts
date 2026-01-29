import express from 'express'
import { setupAccountRoutes } from 'src/routes'

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(setupAccountRoutes());

  return app
}
