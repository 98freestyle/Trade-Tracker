from database import SessionLocal
from models import User, Trade, Deposit
from auth import get_password_hash
from datetime import date

def calculate_trade_metrics(trade):
    """Calculate total cost, P&L, and P&L percentage for a trade"""
    trade.total_cost = trade.entry_price * trade.shares
    
    if trade.exit_price:
        # Calculate raw P&L from price movement
        raw_pl = (trade.exit_price - trade.entry_price) * trade.shares
        
        # Subtract brokerage fees to get net P&L
        trade.profit_loss = raw_pl - (trade.brokerage_fee or 0)
        
        # Calculate percentage return on capital deployed (including fees)
        if trade.total_cost > 0:
            trade.profit_loss_percent = (trade.profit_loss / trade.total_cost) * 100
        else:
            trade.profit_loss_percent = 0
    else:
        trade.profit_loss = None
        trade.profit_loss_percent = None

db = SessionLocal()

# Create test user
user = User(
    email="test@test.com",
    hashed_password=get_password_hash("test123")
)
db.add(user)
db.commit()
db.refresh(user)

# Add deposits (converted from AUD to USD approximately)
deposits = [
    Deposit(user_id=user.id, amount=971.92, deposit_date=date(2025, 6, 13), notes="1500 AUD converted"),
    Deposit(user_id=user.id, amount=641.31, deposit_date=date(2025, 7, 17), notes="1000 AUD converted"),
    Deposit(user_id=user.id, amount=643.25, deposit_date=date(2025, 8, 15), notes="1000 AUD converted"),
    Deposit(user_id=user.id, amount=646.65, deposit_date=date(2025, 9, 6), notes="1000 AUD converted"),
    Deposit(user_id=user.id, amount=657.26, deposit_date=date(2025, 9, 16), notes="1000 AUD converted"),
]

for deposit in deposits:
    db.add(deposit)

# Add trades from your PDF (all with $6 brokerage fee)
trades_data = [
    {"symbol": "SOFI", "entry_date": date(2025, 6, 19), "exit_date": date(2025, 6, 23), 
     "entry_price": 14.89, "exit_price": 14.87, "shares": 34.853, "brokerage_fee": 6.0, "notes": ""},
    
    {"symbol": "AEIS", "entry_date": date(2025, 6, 24), "exit_date": date(2025, 6, 24), 
     "entry_price": 130.60, "exit_price": 129.73, "shares": 3.923, "brokerage_fee": 6.0, "notes": ""},
    
    {"symbol": "NVDA", "entry_date": date(2025, 6, 19), "exit_date": date(2025, 6, 27), 
     "entry_price": 145.40, "exit_price": 155.53, "shares": 3.074, "brokerage_fee": 6.0, "notes": ""},
    
    {"symbol": "AMD", "entry_date": date(2025, 6, 24), "exit_date": date(2025, 7, 11), 
     "entry_price": 132.98, "exit_price": 144.34, "shares": 3.781, "brokerage_fee": 6.0, "notes": ""},
    
    {"symbol": "FTDR", "entry_date": date(2025, 7, 11), "exit_date": date(2025, 7, 21), 
     "entry_price": 58.86, "exit_price": 56.74, "shares": 17.243, "brokerage_fee": 6.0, "notes": "tiny loss didnt wanna bleed"},
    
    {"symbol": "OPEN", "entry_date": date(2025, 7, 19), "exit_date": date(2025, 7, 21), 
     "entry_price": 2.10, "exit_price": 2.95, "shares": 304.073, "brokerage_fee": 6.0, "notes": "Fat profit"},
    
    {"symbol": "SMCI", "entry_date": date(2025, 7, 21), "exit_date": date(2025, 7, 25), 
     "entry_price": 53.48, "exit_price": 53.76, "shares": 34.905, "brokerage_fee": 6.0, "notes": "meh"},
    
    {"symbol": "NVDA", "entry_date": date(2025, 7, 29), "exit_date": date(2025, 8, 1), 
     "entry_price": 174.65, "exit_price": 177.99, "shares": 10.71, "brokerage_fee": 6.0, "notes": "Clean 1.5% scalp, smooth"},
    
    {"symbol": "AMD", "entry_date": date(2025, 8, 2), "exit_date": date(2025, 8, 5), 
     "entry_price": 171.29, "exit_price": 175.86, "shares": 11.094, "brokerage_fee": 6.0, "notes": "Tight scalp, good read"},
    
    {"symbol": "CRWD", "entry_date": date(2025, 8, 6), "exit_date": date(2025, 8, 7), 
     "entry_price": 444.45, "exit_price": 439.96, "shares": 4.376, "brokerage_fee": 6.0, "notes": ""},
    
    {"symbol": "TSM", "entry_date": date(2025, 8, 12), "exit_date": date(2025, 8, 14), 
     "entry_price": 244.23, "exit_price": 236.92, "shares": 7.859, "brokerage_fee": 6.0, "notes": "fuck you"},
    
    {"symbol": "AMZN", "entry_date": date(2025, 8, 19), "exit_date": date(2025, 8, 20), 
     "entry_price": 229.34, "exit_price": 225.00, "shares": 10.898, "brokerage_fee": 6.0, "notes": "yay another L"},
    
    {"symbol": "NVDA", "entry_date": date(2025, 8, 21), "exit_date": date(2025, 8, 22), 
     "entry_price": 170.05, "exit_price": 171.57, "shares": 14.383, "brokerage_fee": 6.0, "notes": "set stop loss too tight"},
    
    {"symbol": "AMD", "entry_date": date(2025, 8, 23), "exit_date": date(2025, 9, 6), 
     "entry_price": 168.23, "exit_price": 150.72, "shares": 14.633, "brokerage_fee": 6.0, "notes": "awesome. should've just let myself get wicked out"},
    
    {"symbol": "VST", "entry_date": date(2025, 9, 6), "exit_date": date(2025, 9, 6), 
     "entry_price": 178.77, "exit_price": 186.54, "shares": 12.303, "brokerage_fee": 6.0, "notes": "Clean scalp"},
    
    {"symbol": "AMZN", "entry_date": date(2025, 9, 6), "exit_date": date(2025, 9, 9), 
     "entry_price": 232.75, "exit_price": 236.53, "shares": 12.613, "brokerage_fee": 6.0, "notes": "Quick scalp"},
    
    {"symbol": "MU", "entry_date": date(2025, 9, 9), "exit_date": date(2025, 9, 10), 
     "entry_price": 133.48, "exit_price": 139.07, "shares": 22.305, "brokerage_fee": 6.0, "notes": "Tight scalp, smooth"},
    
    {"symbol": "CRWD", "entry_date": date(2025, 9, 11), "exit_date": date(2025, 9, 16), 
     "entry_price": 429.89, "exit_price": 445.35, "shares": 7.202, "brokerage_fee": 6.0, "notes": "Split into 2 sells"},
    
    {"symbol": "PLTR", "entry_date": date(2025, 9, 17), "exit_date": date(2025, 9, 18), 
     "entry_price": 170.16, "exit_price": 163.91, "shares": 22.660, "brokerage_fee": 6.0, "notes": "Stop hit"},
    
    {"symbol": "TSLA", "entry_date": date(2025, 9, 17), "exit_date": date(2025, 9, 18), 
     "entry_price": 419.10, "exit_price": 426.24, "shares": 8.848, "brokerage_fee": 6.0, "notes": "Clean scalp"},
    
    {"symbol": "INTC", "entry_date": date(2025, 9, 18), "exit_date": date(2025, 9, 19), 
     "entry_price": 31.29, "exit_price": 32.24, "shares": 120.343, "brokerage_fee": 6.0, "notes": "Decent scalp"},
    
    {"symbol": "AMZN", "entry_date": date(2025, 9, 19), "exit_date": date(2025, 9, 22), 
     "entry_price": 233.72, "exit_price": 229.78, "shares": 16.576, "brokerage_fee": 6.0, "notes": "Stop hit"},
    
    {"symbol": "TSLA", "entry_date": date(2025, 9, 22), "exit_date": date(2025, 9, 24), 
     "entry_price": 437.36, "exit_price": 434.09, "shares": 8.695, "brokerage_fee": 6.0, "notes": "Lossy scalp"},
    
    {"symbol": "AMD", "entry_date": date(2025, 9, 23), "exit_date": date(2025, 9, 25), 
     "entry_price": 161.98, "exit_price": 155.79, "shares": 23.264, "brokerage_fee": 6.0, "notes": "Stop hit"},
]

for trade_data in trades_data:
    trade = Trade(user_id=user.id, **trade_data)
    calculate_trade_metrics(trade)
    db.add(trade)

db.commit()
db.close()

print("✅ Seed data added successfully!")
print("📊 Added 5 deposits and 24 trades (all with $6 brokerage fees)")
print("🔑 Login with: test@test.com / test123")