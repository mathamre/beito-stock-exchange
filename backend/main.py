import csv
import os
import threading
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app import newValue

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data store
data = []

# File path for CSV
CSV_FILE = "data.csv"

# Request model for buying stocks
class BuyRequest(BaseModel):
    name: str
    numberOfStocks: int


def save_to_csv():
    """
    Save the current stock data to a CSV file.
    """
    with open(CSV_FILE, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["name", "value", "numberOfStock", "purchase_impact", "spent"])
        for user in data:
            writer.writerow([
                user["name"],
                ";".join(map(str, user["value"])),
                user["numberOfStock"],
                user.get("purchase_impact", 0),
                user.get("spent", 0),
            ])


def load_from_csv():
    """
    Load stock data from a CSV file if it exists.
    """
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, mode="r") as file:
            reader = csv.DictReader(file)
            loaded_data = []
            for row in reader:
                loaded_data.append({
                    "name": row["name"],
                    "value": list(map(float, row["value"].split(";"))),
                    "numberOfStock": int(row["numberOfStock"]),
                    "purchase_impact": float(row["purchase_impact"]),
                    "spent": float(row["spent"]),
                })
            return loaded_data
    return []


@app.on_event("startup")
async def startup_event():
    """
    FastAPI startup event to load data and start background updates.
    """
    global data
    data = load_from_csv()

    if not data:
        # Initialize with default values if no data exists
        data = [
            {"name": "Olsen", "value": [1], "numberOfStock": 1, "spent": 0, "purchase_impact": 0},
            {"name": "Hansen", "value": [1], "numberOfStock": 1, "spent": 0, "purchase_impact": 0},
            {"name": "Johansen", "value": [1], "numberOfStock": 1, "spent": 0, "purchase_impact": 0},
            {"name": "Thomsen", "value": [1], "numberOfStock": 1, "spent": 0, "purchase_impact": 0},
            {"name": "Nilsen", "value": [1], "numberOfStock": 1, "spent": 0, "purchase_impact": 0},
            {"name": "Andersen", "value": [1], "numberOfStock": 1, "spent": 0, "purchase_impact": 0},
        ]

    # Start the background stock update thread
    threading.Thread(target=newValue.update_stock, args=(data, save_to_csv), daemon=True).start()


@app.get("/data")
def get_data() -> List[dict]:
    """API endpoint to fetch stock data."""
    return data


@app.post("/buy")
def buy_stocks(request: BuyRequest):
    """API endpoint to buy stocks for a user."""
    user = next((item for item in data if item["name"] == request.name), None)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update user stocks
    user["numberOfStock"] += request.numberOfStocks
    current_price = user["value"][-1]
    user["spent"] += request.numberOfStocks * current_price

    # Save data to CSV
    save_to_csv()

    return {"message": f"Successfully bought {request.numberOfStocks} stocks for {request.name}"}
