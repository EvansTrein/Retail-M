import { defineStore } from 'pinia';
import type { IRate } from './types';
import { RateService } from './service';

export const useRateStore = defineStore('reteStore', () => {
  const data = ref<IRate[]>([]);
  const service = new RateService();

  async function loadData(period: string) {
    data.value = await service.loadData(period);
  }

  return { data, loadData };
});