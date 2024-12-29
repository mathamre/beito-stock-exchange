import { NextApiRequest, NextApiResponse } from "next";
import { updateUserStock } from "@/src/lib/DataStorage";

export default function BuyStocksServer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, numberOfStocks } = req.body;

    try {
      updateUserStock(name, numberOfStocks);
      res.status(200).json({
        message: `Successfully bought ${numberOfStocks} stocks for ${name}`,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Now TypeScript knows 'error' has a 'message' property
        throw new Error(`Fetch error: ${error.message}`);
      }
      // Handle cases where 'error' is not an instance of 'Error'
      throw new Error("An unknown error occurred during the fetch operation");
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
