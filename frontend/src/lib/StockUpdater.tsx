export interface User {
  name: string;
  value: number[];
  numberOfStock: number;
  purchaseImpact?: number;
  spent?: number;
}

const spikeCounters: Record<string, number> = {};

export const initializeSpikeCounters = (data: User[]) => {
  if (Object.keys(spikeCounters).length === 0) {
    data.forEach((user) => {
      spikeCounters[user.name] = Math.floor(Math.random() * 251) + 50;
    });
  }
};

export const updateStocks = (data: User[], saveToCSV: () => void) => {
  initializeSpikeCounters(data);

  const totalStocks =
    data.reduce((sum, user) => sum + user.numberOfStock, 0) || 1;

  data.forEach((user) => {
    const currentPrice = user.value[user.value.length - 1];
    const growthFactor = Math.pow(user.numberOfStock / totalStocks, 0.3);
    const baselineGrowthRate = 0.02 * growthFactor;
    const diminishingGrowth = baselineGrowthRate / 10;
    const zigzag = (Math.random() * 2 - 1) * 0.01 * currentPrice;

    let newPrice = currentPrice * (1 + diminishingGrowth) + zigzag;
    newPrice = Math.max(newPrice, 1);

    user.value.push(parseFloat(newPrice.toFixed(2)));
  });

  saveToCSV();
};
