from typing import List, Union

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

data = [
    {
        "name": "Olsen",
        "value": [10],
        "change": 0,
        "numberOfStock": 0,
        "ROI": 0,
        "spent": 0,
    },
    {
        "name": "Hansen",
        "value": [10],
        "change": 0,
        "numberOfStock": 0,
        "ROI": 0,
        "spent": 0,
    },
    {
        "name": "Johansen",
        "value": [10],
        "change": 0,
        "numberOfStock": 0,
        "ROI": 0,
        "spent": 0,
    },
    {
        "name": "Thomsen",
        "value": [10],
        "change": 0,
        "numberOfStock": 0,
        "ROI": 0,
        "spent": 0,
    },
]

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with the specific frontend URL (e.g., "http://localhost:3000") in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model for buying stocks
class BuyRequest(BaseModel):
    name: str
    numberOfStocks: int



@app.get("/data")
def get_data() -> List[dict]:
    """API endpoint to fetch the data"""
    return data


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/buy")
def buy_stocks(request: BuyRequest):
    # Find the user in the data list
    user = next((item for item in data if item["name"] == request.name), None)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update the user's number of stocks
    user["numberOfStock"] += request.numberOfStocks

    # Get the current stock price (last value in the `value` array)
    current_price = user["value"][-1]

    # Update the spent amount
    user["spent"] += request.numberOfStocks * current_price

    return {"message": f"Successfully bought {request.numberOfStocks} stocks for {request.name}", "updatedUser": user}
