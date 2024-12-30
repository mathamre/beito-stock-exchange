import { NextApiRequest, NextApiResponse } from "next";
import { getData } from "@/src/lib/DataStorage";

export default function GetDataServer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const data = getData();
    res.status(200).json(data);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
