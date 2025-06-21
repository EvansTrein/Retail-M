import { logger } from '@/logger';
import { RateService } from '@/services/rate';
import { Request, Response } from 'express';

export class RateController {
  private readonly service: RateService;

  constructor(service: RateService) {
    this.service = service;
  }

  public async rate(req: Request, res: Response): Promise<void> {
    const period = req.query.period;

    if (typeof period !== 'string') {
      res.status(400).json({ error: 'period must be a string' });
      return;
    }

    try {
      const data = await this.service.getRate(period);
      if (!data) {
        logger.warn(`No data found for period ${period}`, { module: 'controllers' });
        res.status(404).json({ error: `No data found for period ${period}` });
        return;
      }
      res.json(data);
    } catch (error) {
      logger.error(`Error fetching rates: ${error}`, { module: 'controllers' });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
