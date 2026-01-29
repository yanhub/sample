import { NextFunction, Request, Response } from 'express'
import { z } from 'zod';

export const validateRequestBodyMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};
