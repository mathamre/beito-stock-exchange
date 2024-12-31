import {User} from "@/lib/DataStorage";

const spikeCounters: Record<string, number> = {};

export const initializeSpikeCounters = (data: User[]) => {
  if (Object.keys(spikeCounters).length === 0) {
    data.forEach((user) => {
      spikeCounters[user.name] =
        Math.floor(Math.random() * (300 - 50 + 1)) + 50; // Random between 50 and 300
    });
  }
};

export const updateStocks = (data: User[], saveToCSV: () => void) => {
  initializeSpikeCounters(data);

  const totalStocks =
    data.reduce((sum, user) => sum + user.numberOfStock, 0) || 1; // Avoid division by zero
  const totalMarketValue =
    data.reduce((sum, user) => sum + user.value[user.value.length - 1], 0) || 1; // Avoid division by zero

  data.forEach((user) => {
    const currentPrice = user.value[user.value.length - 1];
    const userStocks = user.numberOfStock;
    const userName = user.name;

    // Growth factor: Weighted by the number of stocks owned
    const growthFactor = Math.pow(userStocks / totalStocks, 0.3);

    // Stochastic flat period: Random chance for no growth
    if (Math.random() < 0.6) {
      user.value.push(parseFloat(currentPrice.toFixed(2)));
      return;
    }

    // Diminishing returns for growth
    const baselineGrowthRate = 0.02 * growthFactor;
    const diminishingGrowth = baselineGrowthRate / 10;

    // Zigzag effect: Small random fluctuations
    const zigzag = (Math.random() * 2 - 1) * 0.01 * currentPrice;

    const purchaseImpact = user.purchaseImpact || 0;
    user.purchaseImpact = (user.purchaseImpact || 0) * 0.7; // Gradual decay

    let newPrice: number;
    if (spikeCounters[userName] <= 0) {
      const spikeDirection = Math.random() < 0.5 ? -1 : 1;
      const spikeMagnitude =
        (Math.random() * (0.15 - 0.05) + 0.05) * currentPrice * spikeDirection;
      newPrice = Math.max(currentPrice + spikeMagnitude, 1);
      spikeCounters[userName] =
        Math.floor(Math.random() * (300 - 100 + 1)) + 100; // Reset counter
    } else {
      const naturalGrowth = currentPrice * diminishingGrowth;
      newPrice = Math.max(
        currentPrice + naturalGrowth + zigzag + purchaseImpact,
        1
      );
      spikeCounters[userName] -= 1;
    }

    user.value.push(parseFloat(newPrice.toFixed(2)));
  });

  adjustOtherStocks(data, totalMarketValue);
  saveToCSV();

  setTimeout(() => updateStocks(data, saveToCSV), 3000); // 3 seconds
};

export const adjustOtherStocks = (data: User[], totalMarketValue: number) => {
  const totalPurchaseImpact = data.reduce(
    (sum, user) => sum + (user.purchaseImpact || 0),
    0
  );

  if (totalPurchaseImpact > 0) {
    data.forEach((user) => {
      const currentPrice = user.value[user.value.length - 1];
      const userStocks = user.numberOfStock;

      const adjustmentFactor = userStocks / totalMarketValue;
      const priceAdjustment = -(
        totalPurchaseImpact *
        (1 - adjustmentFactor) *
        0.01
      );
      const newPrice = Math.max(currentPrice + priceAdjustment, 1);

      user.value[user.value.length - 1] = parseFloat(newPrice.toFixed(2));
    });
  }
};

export const handlePurchase = (
  userName: string,
  amount: number,
  data: User[]
) => {
  const user = data.find((u) => u.name === userName);
  if (!user) throw new Error("User not found");

  const currentPrice = user.value[user.value.length - 1];

  user.numberOfStock += amount;

  if (amount <= 10) {
    user.purchaseImpact =
      (user.purchaseImpact || 0) + amount * currentPrice * 0.5;
    const spikePct = Math.random() * (0.2 - 0.1) + 0.1;
    const newPrice = Math.max(currentPrice * (1 + spikePct), 1);
    const spikeMagnitude = Math.random() * (0.1 - 0.01) + 0.01 * currentPrice;
    user.value.push(parseFloat((newPrice + spikeMagnitude).toFixed(2)));
  } else if (amount <= 20) {
    user.purchaseImpact =
      (user.purchaseImpact || 0) + amount * currentPrice * 0.8;
    const spikePct = Math.random() * (0.2 - 0.1) + 0.1;
    const newPrice = Math.max(currentPrice * (1 + spikePct), 1);
    const spikeMagnitude = Math.random() * (0.2 - 0.1) + 0.1 * currentPrice;
    user.value.push(parseFloat((newPrice + spikeMagnitude).toFixed(2)));
  } else if (amount <= 30) {
    user.purchaseImpact =
      (user.purchaseImpact || 0) + amount * currentPrice * 1.0;
    const spikePct = Math.random() * (0.2 - 0.1) + 0.1;
    const newPrice = Math.max(currentPrice * (1 + spikePct), 1);
    const spikeMagnitude = Math.random() * (0.3 - 0.2) + 0.2 * currentPrice;
    user.value.push(parseFloat((newPrice + spikeMagnitude).toFixed(2)));
  } else if (amount <= 40) {
    user.purchaseImpact =
      (user.purchaseImpact || 0) + amount * currentPrice * 1.2;
    const spikePct = Math.random() * (0.2 - 0.1) + 0.1;
    const newPrice = Math.max(currentPrice * (1 + spikePct), 1);
    const spikeMagnitude = Math.random() * (0.4 - 0.3) + 0.3 * currentPrice;
    user.value.push(parseFloat((newPrice + spikeMagnitude).toFixed(2)));
  } else if (amount <= 50) {
    user.purchaseImpact =
      (user.purchaseImpact || 0) + amount * currentPrice * 1.75;
    const spikePct = Math.random() * (0.2 - 0.1) + 0.1;
    const newPrice = Math.max(currentPrice * (1 + spikePct), 1);
    const spikeMagnitude = Math.random() * (0.6 - 0.5) + 0.5 * currentPrice;
    user.value.push(parseFloat((newPrice + spikeMagnitude).toFixed(2)));
  } else {
    user.purchaseImpact =
      (user.purchaseImpact || 0) + amount * currentPrice * 2.5;
    const spikePct = Math.random() * (0.3 - 0.2) + 0.2;
    const newPrice = Math.max(currentPrice * (1 + spikePct), 1);
    const spikeMagnitude = Math.random() * (0.1 - 0.6) + 0.6 * currentPrice;
    user.value.push(parseFloat((newPrice + spikeMagnitude).toFixed(2)));
  }
};
