import threading
import random
import math

# Spike counters for stocks
spike_counters = {}

def initialize_spike_counters(data):
    """
    Initialize spike counters for each stock in the data if not already initialized.
    """
    global spike_counters
    if not spike_counters:
        spike_counters = {user["name"]: random.randint(50, 300) for user in data}


def update_stock(data, save_to_csv) -> None:
    """
    Continuously update stock prices with diminishing growth and volatility.
    """
    global spike_counters
    initialize_spike_counters(data)  # Ensure spike counters are set

    total_stocks = sum(user["numberOfStock"] for user in data) or 1  # Avoid division by zero
    total_market_value = sum(user["value"][-1] for user in data) or 1  # Avoid division by zero

    for user in data:
        current_price = user["value"][-1]
        user_stocks = user["numberOfStock"]
        user_name = user["name"]

        # Growth factor: Weighted by the number of stocks owned
        growth_factor = user_stocks / total_stocks

        # Stochastic flat period: Random chance for no growth
        if random.random() < 0.3:  # 30% chance to skip growth
            user["value"].append(round(current_price, 2))
            continue

        # Diminishing returns for growth: Logarithmic or square-root based growth
        baseline_growth_rate = 0.002 + (0.05 * growth_factor)
        diminishing_growth = baseline_growth_rate * math.sqrt(current_price) / (current_price + 1)

        # Zigzag effect: Add small random fluctuations to simulate volatility
        zigzag = random.uniform(-0.01, 0.01) * current_price

        # Handle purchase impact
        purchase_impact = user.get("purchase_impact", 0)
        user["purchase_impact"] *= 0.9  # Gradual decay

        # Handle random spike
        if spike_counters[user_name] <= 0:
            spike_direction = random.choice([-1, 1])
            spike_magnitude = random.uniform(0.05, 0.15) * current_price * spike_direction
            new_price = max(current_price + spike_magnitude, 1)
            spike_counters[user_name] = random.randint(100, 300)  # Reset counter
        else:
            natural_growth = current_price * diminishing_growth
            new_price = current_price + natural_growth + zigzag + purchase_impact
            new_price = max(new_price, 1)  # Ensure minimum price
            spike_counters[user_name] -= 1

        # Append the new price
        user["value"].append(round(new_price, 2))

    # Adjust other stocks
    adjust_other_stocks(data, total_market_value)
    save_to_csv()

    # Schedule the next update
    threading.Timer(1, update_stock, args=(data, save_to_csv)).start()


def adjust_other_stocks(data, total_market_value):
    """
    Adjust other stocks' prices when one is heavily purchased.
    """
    total_purchase_impact = sum(user.get("purchase_impact", 0) for user in data)

    if total_purchase_impact > 0:
        for user in data:
            current_price = user["value"][-1]
            user_stocks = user["numberOfStock"]

            # Adjust proportionally
            adjustment_factor = user_stocks / total_market_value if total_market_value else 0
            price_adjustment = -(total_purchase_impact * (1 - adjustment_factor) * 0.01)  # Slightly smaller adjustment
            new_price = max(current_price + price_adjustment, 1)
            user["value"][-1] = round(new_price, 2)  # Update current price in place


def handle_purchase(user_name: str, amount: int, data) -> None:
    """
    Handle the purchase of stocks, dynamically impacting the price.
    """
    for user in data:
        if user["name"] == user_name:
            current_price = user["value"][-1]
            # Record the purchase impact, scaled heavily by the number of stocks bought and price
            user["purchase_impact"] += (amount * current_price * 0.4)  # Higher impact for purchases

            # Update the user's stock count
            user["numberOfStock"] += amount
