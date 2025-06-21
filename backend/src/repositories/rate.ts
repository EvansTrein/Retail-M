import { logger } from '@/logger';
import { MongoClient } from 'mongodb';
import { IRate } from '@/entities/rate';
import dotenv from 'dotenv';
import { getApiData } from '@/exchange-api/coingecko';

dotenv.config({ path: 'local.env' });

const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME;

export class RateRepo {
  private readonly mongo: MongoClient;

  constructor(db: MongoClient) {
    this.mongo = db;
  }

  public async initData(): Promise<void> {
    const db = this.mongo.db(MONGO_DB_NAME);
    const collection = db.collection(MONGO_COLLECTION_NAME!);

    try {
      const count = await collection.countDocuments();

      if (count > 0) {
        logger.info('Collection is not empty. Skipping data initialization.', { module: 'repositories' });
        return;
      }

      logger.info('Collection is empty. Initializing with default data...', { module: 'repositories' });

      const dailyRates = await getApiData(1);
      const weeklyRates = await getApiData(7);
      const monthlyRates = await getApiData(30);
      const yearlyRates = await getApiData(365);

      await this.saveRate('day', dailyRates);
      await this.saveRate('week', weeklyRates);
      await this.saveRate('month', monthlyRates);
      await this.saveRate('year', yearlyRates);

      logger.info('Initialization completed successfully.', { module: 'repositories' });
    } catch (err) {
      logger.error(`Error during data initialization: ${err}`, { module: 'repositories' });
      throw err;
    }
  }

  public async saveRate(key: string, value: IRate[]): Promise<void> {
    const db = this.mongo.db(MONGO_DB_NAME);
    const collection = db.collection(MONGO_COLLECTION_NAME!);

    const document = {
      key,
      data: value,
    };

    try {
      await collection.insertOne(document);
      logger.info(`Saved ${value.length} rate entries for key "${key}"`, { module: 'repositories' });
    } catch (err) {
      logger.error(`Failed to save rate data for key "${key}" \n error - ${err}`, { module: 'repositories' });
      throw err;
    }
  }

  public async getRate(key: string): Promise<IRate[] | null> {
    const db = this.mongo.db(MONGO_DB_NAME);
    const collection = db.collection(MONGO_COLLECTION_NAME!);

    try {
      const result = await collection.findOne({ key });

      if (!result) {
        logger.warn(`key - ${key} not found`, { module: 'repositories' });
        return null;
      }

      logger.info(`Fetched ${result.data.length} rate entries for key "${key}"`, { module: 'repositories' });

      return result.data;
    } catch (err) {
      logger.error(`Failed to fetch rate data for key "${key}" \n error- ${err}`, { module: 'repositories' });
      throw err;
    }
  }
}
