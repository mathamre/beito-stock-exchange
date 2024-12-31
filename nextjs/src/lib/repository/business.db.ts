import prisma from "@/lib/prisma";

interface NewBusinessInput {
  name: string;
}

export async function addBusiness(input: NewBusinessInput) {
  try {
    const newBusiness = await prisma.business.create({
      data: {
        name: input.name,
        portfolio: {
          create: {}, // Create an empty portfolio or populate it with initial data
        },
      },
    });
    return newBusiness;
  } catch (error) {
    console.error("Error adding business with portfolio:", error);
    throw error;
  }
}
