//import prisma from "@/src/lib/prisma";
import prisma from "../prisma.ts";
import seedrandom from "seedrandom";

interface NewBusinessInput {
  name: string;
}

export async function addBusiness(input: NewBusinessInput) {
  try {
    const newBusiness = await prisma.business.create({
      data: {
        name: input.name,
        portfolio: {
          create: {},
        },
      },
    });
    return newBusiness;
  } catch (error) {
    console.error("Error adding business with portfolio:", error);
    throw error;
  }
}

// Generate a new seed for every build
const seed = Date.now().toString(); // Example: use timestamp for uniqueness

const rng = seedrandom(seed); // Seeded random number generator
console.log(`Seed for this build: ${seed}`);

// Helper function to generate random numbers with normal distribution
function getRandomNormal(mean: number, stdDev: number): number {
  const u1 = rng(); // Use seeded random number generator
  const u2 = rng(); // Use seeded random number generator
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2); // Box-Muller Transform
  return z0 * stdDev + mean;
}

async function seedStocks() {
  try {
    const stockData = [
      { name: "Beito Hydrogen", current_price: 100, volatility: 100 },
      { name: "Beito Adult Services", current_price: 100, volatility: 80 },
      { name: "Beito DekkMerkeReparatør", current_price: 100, volatility: 60 },
      { name: "Beito Stølnet", current_price: 100, volatility: 40 },
      { name: "Beito Bank", current_price: 100, volatility: 20 },
      { name: "Tele Beito", current_price: 100, volatility: 1 },
    ];

    for (const stock of stockData) {
      const existingStock = await prisma.stock.findFirst({
        where: { name: stock.name },
      });

      if (!existingStock) {
        await prisma.stock.create({ data: stock });
        console.log(`Stock '${stock.name}' added to the database.`);
      } else {
        console.log(`Stock '${stock.name}' already exists.`);
      }
    }
  } catch (error) {
    console.error("Error seeding stocks:", error);
    throw error;
  }
}

async function updateStockPrices() {
  try {
    // Fetch all stocks from the database
    const stocks = await prisma.stock.findMany();

    for (const stock of stocks) {
      const dailyReturn = getRandomNormal(0, stock.volatility / Math.sqrt(252)); // Simulate daily return
      const newPrice = stock.current_price * (1 + dailyReturn); // Calculate new price

      // Update the stock price in the database
      await prisma.stock.update({
        where: { id: stock.id },
        data: { current_price: newPrice },
      });

      console.log(
        `Updated price for '${stock.name}': ${stock.current_price.toFixed(
          2
        )} -> ${newPrice.toFixed(2)}`
      );
    }
  } catch (error) {
    console.error("Error updating stock prices:", error);
    throw error;
  }
}

async function main() {
  await seedStocks();
  console.log("Database seeding completed.");

  // Simulate stock price updates every 10 seconds
  setInterval(async () => {
    await updateStockPrices();
  }, 1000);
}

main()
  .catch((e) => {
    console.error("Error during database initialization:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
