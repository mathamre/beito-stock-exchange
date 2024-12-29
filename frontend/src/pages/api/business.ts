import { NextApiRequest, NextApiResponse } from "next";
import {addBusiness} from "@/src/lib/repository/business.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { name } = req.body;

        // Validate input
        if (!name) {
            return res.status(400).json({ success: false, error: "Name is required." });
        }

        try {
            const newBusiness = await addBusiness({ name });
            res.status(201).json({ success: true, data: newBusiness });
        } catch (error) {
            console.error("Error adding business:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
