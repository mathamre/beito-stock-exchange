import prisma from "@/src/lib/prisma";

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

async function main() {
  await seedStocks();
  console.log("Database seeding completed.");
}

main()
  .catch((e) => {
    console.error("Error during database initialization:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
