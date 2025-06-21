import dotenv from 'dotenv';
import { App } from './src/app';
import { logger } from './src/logger';

dotenv.config({ path: '../local.env' });

const app = new App();
const PORT = process.env.PORT || '3000';
app.start(PORT);

const gracefulShutdown = async () => {
  logger.info('Received shutdown signal', { module: 'main' });
  try {
    await app.stop();
    logger.info('Shutdown complete', { module: 'main' });
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', { error: err }, { module: 'main' });
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGQUIT', gracefulShutdown);
