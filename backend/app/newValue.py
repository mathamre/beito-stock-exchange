import threading
import random
import main

# Initialize spike_counters lazily
spike_counters = None


def initialize_spike_counters():
    """
    Initialize spike counters for each stock in the data.
    """
    global spike_counters
    if spike_counters is None:
        spike_counters = {user["name"]: random.randint(50, 200) for user in main.data}


def update_stock() -> None:
    """
    Continuously update stock prices with zigzagging behavior and random price spikes.
    """
    initialize_spike_counters()  # Ensure spike_counters are initialized

    total_stocks = sum(user["numberOfStock"] for user in main.data)  # Total stocks in the market
    total_market_value = sum(user["value"][-1] for user in main.data)  # Total value of all stocks

    for user in main.data:
        current_price = user["value"][-1]
        user_stocks = user["numberOfStock"]
        user_name = user["name"]

        # Dynamic growth rate: Proportional to the user's stock count and market value
        if total_stocks > 0:
            growth_factor = user_stocks / total_stocks
        else:
            growth_factor = 0.2
        baseline_growth_rate = 0.005 + (0.02 * growth_factor)  # Scale growth rate by stock ownership

        # Volatility: Create zigzag behavior
        zigzag_volatility = random.uniform(-0.05, 0.05) * current_price

        # Purchase impact and decay
        purchase_impact = user.get("purchase_impact", 0)
        decay_factor = 0.85
        user["purchase_impact"] *= decay_factor

        # Handle random spike
        spike_counter = spike_counters[user_name]
        if spike_counter <= 0:
            # Trigger a spike
            spike_direction = random.choice([-1, 1])  # Negative or positive spike
            spike_magnitude = random.uniform(0.1, 0.3) * current_price * spike_direction
            new_price = current_price + spike_magnitude

            # Ensure the price doesn't fall below the minimum value
            minimum_price = max(total_market_value * 0.01, 1)
            new_price = max(new_price, minimum_price)

            # Reset the spike counter
            spike_counters[user_name] = random.randint(50, 200)  # New random threshold
        else:
            # Regular price update
            natural_growth = current_price * baseline_growth_rate
            new_price = current_price + natural_growth + zigzag_volatility + purchase_impact

            # Ensure price doesn't drop below a meaningful minimum
            minimum_price = max(total_market_value * 0.01, 1)  # 1% of market average or 1
            if new_price < minimum_price:
                new_price = minimum_price

            # Decrement the spike counter
            spike_counters[user_name] -= 1

        # Update the stock price
        user["value"].append(round(new_price, 2))

    # Adjust other stocks' prices when one is heavily purchased
    adjust_other_stocks(main.data, total_market_value)

    # Schedule the next update
    threading.Timer(10, update_stock).start()


def adjust_other_stocks(data, total_market_value):
    """
    Adjust other stocks' prices when one is heavily purchased.
    """
    total_purchase_impact = sum(user.get("purchase_impact", 0) for user in data)

    if total_purchase_impact > 0:
        for user in data:
            current_price = user["value"][-1]
            user_stocks = user["numberOfStock"]

            # Reduce price for other stocks proportionally to their market share
            adjustment_factor = user_stocks / total_market_value
            price_adjustment = -(total_purchase_impact * adjustment_factor * 0.02)

            # Update price, ensuring it doesn't fall below the minimum
            user["value"][-1] = max(current_price + price_adjustment, 1)


def handle_purchase(user_name: str, amount: int) -> None:
    """
    Handle the purchase of stocks, dynamically impacting the price.
    """
    for user in main.data:
        if user["name"] == user_name:
            # Record the purchase impact, scaled by the number of stocks bought
            user["purchase_impact"] += amount * 0.2  # Increase impact more aggressively for larger purchases

            # Update the user's stock count
            user["numberOfStock"] += amount
