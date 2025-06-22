import { defineStore } from 'pinia';
import type { IRate } from './types';
import { RateService } from './service';

export const useRateStore = defineStore('reteStore', () => {
  const data = ref<IRate[]>([]);
  const service = new RateService();
  const isLoad = ref<boolean>(false);

  async function loadData(period: string) {
		isLoad.value = true
    data.value = await service.loadData(period);
		isLoad.value = false
  }

  async function loadRangeData(from: number, to: number) {
		isLoad.value = true
    const res = await service.loadRangeData(from, to);
    if (!res) {
			isLoad.value = false
      return;
    }
    console.log('New data loaded:', res);
    data.value = res;
		isLoad.value = false
  }

  return { data, loadData, loadRangeData, isLoad };
});
