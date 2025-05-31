import { BLOCKSCHOLES_API_KEY } from '../config';

type BlockScholesResponse = {
  data: Array<{
    values: Array<{
      strike: number;
      v: number;
      type: string;
    }>;
    timestamp: number;
  }>;
};

export async function getOptionPrice(strike: number, type: 'C' | 'P'): Promise<number> {
  try {
    const response = await fetch('https://prod-data.blockscholes.com/api/v1/price/mark', {
      method: 'POST',
      headers: {
        'X-API-Key': 'VCF0HVhT3l421hmiTezkD5XZDEpU21qO7pLKKXSA',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify({
        base_asset: "BTC",
        asset_type: "option",
        expiry: "2025-06-27T08:00:00Z",
        strike: [strike],
        type: [type],
        start: "LATEST",
        end: "LATEST",
        frequency: "1m",
        options: {
          format: {
            timestamp: "ms",
            hexify: false,
            decimals: 3
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch option price');
    }

    const data: BlockScholesResponse = await response.json();
    return data.data[0].values[0].v;
  } catch (error) {
    console.error('Error fetching option price:', error);
    return 0;
  }
}