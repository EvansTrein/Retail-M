import { IRate } from '@/entities/rate';
import { RateRepo } from '@/repositories/rate';

export class RateService {
  private readonly repo: RateRepo;

  constructor(repo: RateRepo) {
    this.repo = repo;
  }

  public async getRate(period: string): Promise<IRate[] | null> {
    const result = await this.repo.getRate(period);

    return result;
  }
}
