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
        growth_factor = (user_stocks / total_stocks) ** 0.3

        # Stochastic flat period: Random chance for no growth
        if random.random() < 0.6:  # 30% chance to skip growth
            user["value"].append(round(current_price, 2))
            continue

        # Diminishing returns for growth: Logarithmic or square-root based growth
        baseline_growth_rate = 0 + (0.02 * growth_factor)
        #diminishing_growth = baseline_growth_rate * math.sqrt(current_price) / (current_price + 1)
        diminishing_growth = baseline_growth_rate / 10

        # Zigzag effect: Add small random fluctuations to simulate volatility
        zigzag = random.uniform(-0.01, 0.01) * current_price

        # Handle purchase impact
        purchase_impact = user.get("purchase_impact", 0)
        user["purchase_impact"] *= 0.7  # Gradual decay

        # Handle random spike
        if spike_counters[user_name] <= 0:
            spike_direction = random.choice([-1, 1])
            spike_magnitude = random.uniform(0.05, 0.15) * current_price * spike_direction
            new_price = max(current_price + spike_magnitude, 1)
            spike_counters[user_name] = random.randint(100, 300)  # Reset counter
        else:
            natural_growth = current_price * diminishing_growth
            new_price = current_price + zigzag + purchase_impact
            new_price = max(new_price, 1) 
            spike_counters[user_name] -= 1

        # Append the new price
        user["value"].append(round(new_price, 2))

    # Adjust other stocks
    adjust_other_stocks(data, total_market_value)
    save_to_csv()

    # Schedule the next update
    threading.Timer(3, update_stock, args=(data, save_to_csv)).start()


def adjust_other_stocks(data, total_market_value):
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
    for user in data:
        if user["name"] == user_name:
            current_price = user["value"][-1]
               
            user["numberOfStock"] += amount
            if amount <= 10:
                user["purchase_impact"] += (amount * current_price * 0.5) 
                spike_pct = random.uniform(0.1, 0.2)
                new_price = max(current_price * (1 + spike_pct), 1)
                spike_magnitude = random.uniform(0.01, 0.1) * current_price
                user["value"].append(round(new_price + spike_magnitude, 2))
            elif amount > 10 and amount <= 20:
                user["purchase_impact"] += (amount * current_price * 0.8) 
                spike_pct = random.uniform(0.1, 0.2)
                new_price = max(current_price * (1 + spike_pct), 1)
                spike_magnitude = random.uniform(0.1, 0.2) * current_price
                user["value"].append(round(new_price + spike_magnitude, 2))
            elif amount > 20 and amount <= 30:
                user["purchase_impact"] += (amount * current_price * 1) 
                spike_pct = random.uniform(0.1, 0.2)
                new_price = max(current_price * (1 + spike_pct), 1)
                spike_magnitude = random.uniform(0.2, 0.3) * current_price
                user["value"].append(round(new_price + spike_magnitude, 2))
            elif amount > 30 and amount <= 40:
                user["purchase_impact"] += (amount * current_price * 1.2)
                spike_pct = random.uniform(0.1, 0.2)
                new_price = max(current_price * (1 + spike_pct), 1)
                spike_magnitude = random.uniform(0.3, 0.4) * current_price
                user["value"].append(round(new_price + spike_magnitude, 2))
            elif amount > 40 and amount <= 50:
                user["purchase_impact"] += (amount * current_price * 1.75)
                spike_pct = random.uniform(0.1, 0.2)
                new_price = max(current_price * (1 + spike_pct), 1)
                spike_magnitude = random.uniform(0.5, 0.6) * current_price
                user["value"].append(round(new_price + spike_magnitude, 2))
            elif amount > 50:
                user["purchase_impact"] += (amount * current_price * 2.5)   
                spike_pct = random.uniform(0.2, 0.3)
                new_price = max(current_price * (1 + spike_pct), 1)
                spike_magnitude = random.uniform(0.6, 0.1) * current_price
                user["value"].append(round(new_price + spike_magnitude, 2))


       
# import threading
# import random
# import math

# # Spike counters for stocks
# spike_counters = {}

# # Track previous stock counts so we can detect "new" stock purchases each cycle
# previous_stock_counts = {}

# def initialize_spike_counters(data):
#     global spike_counters
#     if not spike_counters:
#         spike_counters = {user["name"]: random.randint(50, 300) for user in data}

# def initialize_previous_stock_counts(data):
#     global previous_stock_counts
#     if not previous_stock_counts:
#         previous_stock_counts = {user["name"]: user["numberOfStock"] for user in data}

# def update_stock(data, save_to_csv) -> None:
#     global spike_counters, previous_stock_counts

#     initialize_spike_counters(data)
#     initialize_previous_stock_counts(data)

#     total_market_value = sum(user["value"][-1] for user in data) or 1  # Avoid division by zero

#     for user in data:
#         current_price = user["value"][-1]
#         user_name = user["name"]
#         current_stocks = user["numberOfStock"]
#         old_stocks = previous_stock_counts[user_name]

#         # 1) Detect newly bought stocks since last cycle
#         newly_bought = max(0, current_stocks - old_stocks)
        
#         # 2) Price bump from newly acquired stocks
#         #    Example: 0.5% price bump per new stock (adjust to your liking)
#         growth_from_new_stocks = (current_price * 0.005 * newly_bought)

#         # 3) Small random zigzag
#         zigzag = random.uniform(-0.01, 0.01) * current_price  # up to ±1%

#         # 4) Purchase impact from handle_purchase (which decays each cycle)
#         purchase_impact = user.get("purchase_impact", 0)
#         user["purchase_impact"] *= 0.95  # Gradual decay

#         # 5) Check for random spike
#         if spike_counters[user_name] <= 0:
#             spike_direction = random.choice([-1, 1])
#             spike_magnitude = random.uniform(0.05, 0.15) * current_price * spike_direction
#             new_price = current_price + spike_magnitude
#             # Ensure minimum price
#             new_price = max(new_price, 1)

#             # Reset spike counter
#             spike_counters[user_name] = random.randint(100, 300)
#         else:
#             # Normal update
#             new_price = current_price + growth_from_new_stocks + zigzag + purchase_impact
#             new_price = max(new_price, 1)
#             spike_counters[user_name] -= 1

#         user["value"].append(round(new_price, 2))

#         # Update stored stock count for next cycle
#         previous_stock_counts[user_name] = current_stocks

#     # Optional: adjust other stocks if desired
#     adjust_other_stocks(data, total_market_value)

#     save_to_csv()

#     # Schedule the next update
#     threading.Timer(0.01, update_stock, args=(data, save_to_csv)).start()


# def adjust_other_stocks(data, total_market_value):

#     total_purchase_impact = sum(user.get("purchase_impact", 0) for user in data)

#     if total_purchase_impact > 0:
#         for user in data:
#             current_price = user["value"][-1]
#             user_stocks = user["numberOfStock"]

#             # Adjust proportionally
#             adjustment_factor = user_stocks / total_market_value if total_market_value else 0
#             # Slight downward adjustment for others
#             price_adjustment = -(total_purchase_impact * (1 - adjustment_factor) * 0.01)
#             new_price = max(current_price + price_adjustment, 1)
#             user["value"][-1] = round(new_price, 2)  # Update current price in place


# def handle_purchase(user_name: str, amount: int, data) -> None:
#     """
#     Handle the purchase of stocks, dynamically impacting the price.
#     Adds immediate mini-spikes for large purchases.
#     """
#     for user in data:
#         if user["name"] == user_name:
#             current_price = user["value"][-1]
            
#             # Increase stock count
#             user["numberOfStock"] += amount

#             # Scale purchase impact by amount and price. 
#             # Increase multiplier for bigger amounts:
#             if amount <= 10:
#                 user["purchase_impact"] += (amount * current_price * 0.5) 
#             elif amount <= 20:
#                 user["purchase_impact"] += (amount * current_price * 0.8) 
#             elif amount <= 30:
#                 user["purchase_impact"] += (amount * current_price * 1.0) 
#             elif amount <= 40:
#                 user["purchase_impact"] += (amount * current_price * 1.2)
#             elif amount <= 50:
#                 user["purchase_impact"] += (amount * current_price * 1.75)
#                 # Immediate mini-spike
#                 spike_pct = random.uniform(0.1, 0.2)
#                 new_price = max(current_price * (1 + spike_pct), 1)
#                 user["value"].append(round(new_price, 2))
#             else:
#                 # For > 50
#                 user["purchase_impact"] += (amount * current_price * 2.5)   
#                 # Immediate bigger spike
#                 spike_pct = random.uniform(0.2, 0.3)
#                 new_price = max(current_price * (1 + spike_pct), 1)
#                 user["value"].append(round(new_price, 2))
