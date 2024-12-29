import fs from "fs";
import path from "path";

export interface User {
  name: string;
  value: number[];
  numberOfStock: number;
  purchaseImpact?: number;
  spent?: number;
}

const CSV_FILE = path.resolve("./data.csv");
let data: User[] = [];

// Load data from CSV
export const loadFromCSV = (): User[] => {
  if (fs.existsSync(CSV_FILE)) {
    const fileData = fs.readFileSync(CSV_FILE, "utf-8");
    const rows = fileData.split("\n").slice(1); // Skip header
    return rows.map((row) => {
      const [name, value, numberOfStock, purchaseImpact, spent] =
        row.split(",");
      return {
        name,
        value: value.split(";").map(Number),
        numberOfStock: parseInt(numberOfStock, 10),
        purchaseImpact: parseFloat(purchaseImpact) || 0,
        spent: parseFloat(spent) || 0,
      };
    });
  }
  return [];
};

// Save data to CSV
export const saveToCSV = () => {
  const header = "name,value,numberOfStock,purchaseImpact,spent";
  const rows = data.map(
    (user) =>
      `${user.name},${user.value.join(";")},${user.numberOfStock},${
        user.purchaseImpact || 0
      },${user.spent || 0}`
  );
  fs.writeFileSync(CSV_FILE, `${header}\n${rows.join("\n")}`, "utf-8");
};

// Initialize data
export const initializeData = () => {
  data = loadFromCSV();
  if (data.length === 0) {
    data = [
      { name: "Olsen", value: [1], numberOfStock: 1 },
      { name: "Hansen", value: [1], numberOfStock: 1 },
      { name: "Johansen", value: [1], numberOfStock: 1 },
      { name: "Thomsen", value: [1], numberOfStock: 1 },
      { name: "Nilsen", value: [1], numberOfStock: 1 },
      { name: "Andersen", value: [1], numberOfStock: 1 },
    ];
  }
};

export const getData = (): User[] => data;

export const updateUserStock = (name: string, numberOfStocks: number) => {
  const user = data.find((u) => u.name === name);
  if (!user) throw new Error("User not found");

  const currentPrice = user.value[user.value.length - 1];
  user.numberOfStock += numberOfStocks;
  user.spent = (user.spent || 0) + numberOfStocks * currentPrice;

  saveToCSV();
};
