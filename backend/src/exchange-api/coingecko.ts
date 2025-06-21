import dotenv from 'dotenv';
import { IRate } from '@/entities/rate';

dotenv.config({ path: 'local.env' });

const BASE_URL = 'https://api.coingecko.com/api/v3';
const apiKey = process.env.KEY;

export async function getApiData(days: number): Promise<IRate[]> {
  const url = `${BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&precision=3`;
  const options = {
    method: 'GET',
    headers: { accept: 'application/json', 'x-cg-demo-api-key': apiKey! },
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.prices)) {
    throw new Error('Invalid or missing "prices" field in API response');
  }

  const rates: IRate[] = data.prices.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
  }));

  return rates;
}

export async function getApiRangeData(from: number, to: number): Promise<IRate[]> {
  const url = `${BASE_URL}/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${to}&precision=3`;
  const options = {
    method: 'GET',
    headers: { accept: 'application/json', 'x-cg-demo-api-key': apiKey! },
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.prices)) {
    throw new Error('Invalid or missing "prices" field in API response');
  }

  const rates: IRate[] = data.prices.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
  }));

  return rates;
}
