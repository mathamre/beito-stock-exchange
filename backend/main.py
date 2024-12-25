import asyncio
import json
import random
from typing import List, Union

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from app import newValue


app = FastAPI()

data = [
    {
        "name": "Olsen",
        "value": [10],
        "change": 0,
        "numberOfStock": 0,
        "lastBoughtShares": 0,
        "countedLastBoughtShares": "false",
        "spent": 0,
        "recent_activity": 0, 
            "purchase_impact": 0
    },
    {
        "name": "Hansen",
        "value": [10],
        "change": 0,
        "numberOfStock": 0,
        "lastBoughtShares": 0,
        "countedLastBoughtShares": "false",
        "spent": 0,
        "recent_activity": 0, 
        "purchase_impact": 0
    },
    {
        "name": "Johansen",
        "value": [10],
        "change": 0,
        "numberOfStock": 0,
        "lastBoughtShares": 0,
        "countedLastBoughtShares": "false",
        "spent": 0,
        "recent_activity": 0, 
        "purchase_impact": 0
    },
    {
        "name": "Thomsen",
        "value": [10],
        "change": 0,
        "numberOfStock": 0,
        "lastBoughtShares": 0,
        "countedLastBoughtShares": "false",
        "spent": 0,
        "recent_activity": 0, 
        "purchase_impact": 0
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
    user["lastBoughtShares"] += request.numberOfStocks

    # Get the current stock price (last value in the `value` array)
    current_price = user["value"][-1]

    # Update the spent amount
    user["spent"] += request.numberOfStocks * current_price

    return {"message": f"Successfully bought {request.numberOfStocks} stocks for {request.name}", "updatedUser": user}



class ValueRequest(BaseModel):
    current_value: float
    increment: float

newValue.update_stock()

# @app.post("/calculate")
# def calculate(request: ValueRequest):
#     """
#     API endpoint to calculate a new value.
#     """
#     new_value = newValue.calculate_new_value(request.current_value, request.increment)
#     return {"new_value": new_value}


# clients = []

# async def send_data_periodically(websocket: WebSocket):
#     while True:
#         # Simulate new stock data
#         stock_data = {
#             "name": "Olsen",
#             "value": [round(random.uniform(20, 30), 2)],  # Random price
#             "change": round(random.uniform(-0.05, 0.05), 2),
#             "numberOfStock": 10,
#         }
#         await websocket.send_text(json.dumps(stock_data))
#         await asyncio.sleep(10)  # Send data every 10 seconds

# @app.websocket("/ws/stocks")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     clients.append(websocket)
#     try:
#         while True:
#             await send_data_periodically(websocket)
#     except WebSocketDisconnect:
#         clients.remove(websocket)