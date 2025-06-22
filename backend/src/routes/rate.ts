import express from 'express';
import { Request, Response } from 'express';
import { RateController } from '@controllers/rate';

export function initRouterRate(controller: RateController): express.Router {
  const router = express.Router();

  router.get('/rate', (req: Request, res: Response) => {
    controller.rate(req, res);
  });

	router.get('/range', (req: Request, res: Response) => {
    controller.range(req, res);
  })

  return router;
}