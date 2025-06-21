import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { RateController } from '@controllers/rate';
import { initRouterRate } from '@routes/rate';
import { logger } from './logger';
import { RateRepo } from '@repo/rate';
import { RateService } from '@services/rate';

dotenv.config({ path: 'local.env' });

export class App {
  private server: http.Server;
  private db: MongoClient;

  constructor() {
    const expressInst = express();
    this.server = http.createServer(expressInst);
    this.db = new MongoClient(process.env.MONGO_URI!, {
      monitorCommands: true,
    });

    logger.info(`successful connect DB to ${process.env.MONGO_URI}`, { module: 'app' });

    const allowedOrigins = process.env.CLIENT_ORIGINS
      ? process.env.CLIENT_ORIGINS.split(',')
      : ['http://localhost:5173'];

    expressInst.use(
      cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
      })
    );

    expressInst.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes time window
        max: 200, // limit each IP to 200 requests per window
      })
    );

    expressInst.use(express.json());
    expressInst.use(express.urlencoded({ extended: true }));

    const rateRepo = new RateRepo(this.db);
    rateRepo.initData();

    const rateService = new RateService(rateRepo);
    const rateController = new RateController(rateService);

    expressInst.use('/api', initRouterRate(rateController));
  }

  public async start(port: string): Promise<void> {
    this.server.listen(port, () => {
      logger.info(`http server running on port - ${port}`, { module: 'app' });
    });
  }

  public async stop(): Promise<void> {
    logger.info('Starting graceful shutdown');

    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          logger.error('Error during server close:', { error: err }, { module: 'app' });
          return reject(err);
        }
        logger.info('HTTP server closed', { module: 'app' });
        this.db.close();
        logger.info('MongoDB connection closed', { module: 'app' });
        resolve();
      });
    });
  }
}
