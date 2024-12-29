import prisma from "@/src/lib/prisma";

interface NewBusinessInput {
    name: string;
}

export async function addBusiness(input: NewBusinessInput) {
    try {
        const newBusiness = await prisma.business.create({
            data: {
                name: input.name, // Only the `name` field is required
            },
        });
        return newBusiness;
    } catch (error) {
        console.error("Error adding business:", error);
        throw error;
    }
}
