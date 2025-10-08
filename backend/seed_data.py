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

# Add deposits (real USD amounts from Stake)
deposits = [
    Deposit(user_id=user.id, amount=971.92, deposit_date=date(2025, 6, 13), notes="1500 AUD converted"),
    Deposit(user_id=user.id, amount=641.31, deposit_date=date(2025, 7, 17), notes="1000 AUD converted"),
    Deposit(user_id=user.id, amount=643.25, deposit_date=date(2025, 8, 15), notes="1000 AUD converted"),
    Deposit(user_id=user.id, amount=646.65, deposit_date=date(2025, 9, 6), notes="1000 AUD converted"),
    Deposit(user_id=user.id, amount=657.26, deposit_date=date(2025, 9, 16), notes="1000 AUD converted"),
]

for deposit in deposits:
    db.add(deposit)

# Add trades from Stake transaction history
trades_data = [
    # NVDA Trade 1
    {"symbol": "NVDA", "entry_date": date(2025, 6, 18), "exit_date": date(2025, 6, 26), 
     "entry_price": 145.40, "exit_price": 155.53, "shares": 3.07430111, "brokerage_fee": 6.0, "notes": ""},
    
    # SOFI Trade
    {"symbol": "SOFI", "entry_date": date(2025, 6, 18), "exit_date": date(2025, 6, 23), 
     "entry_price": 14.89, "exit_price": 14.87, "shares": 34.85304389, "brokerage_fee": 6.0, "notes": ""},
    
    # AEIS Trade
    {"symbol": "AEIS", "entry_date": date(2025, 6, 23), "exit_date": date(2025, 6, 23), 
     "entry_price": 130.60, "exit_price": 129.73, "shares": 3.92258052, "brokerage_fee": 6.0, "notes": ""},
    
    # AMD Trade 1
    {"symbol": "AMD", "entry_date": date(2025, 6, 23), "exit_date": date(2025, 7, 10), 
     "entry_price": 132.98, "exit_price": 144.34, "shares": 3.78149807, "brokerage_fee": 6.0, "notes": ""},
    
    # FTDR Trade
    {"symbol": "FTDR", "entry_date": date(2025, 7, 10), "exit_date": date(2025, 7, 21), 
     "entry_price": 58.86, "exit_price": 56.74, "shares": 17.24384579, "brokerage_fee": 6.0, "notes": "tiny loss didnt wanna bleed"},
    
    # OPEN Trade
    {"symbol": "OPEN", "entry_date": date(2025, 7, 18), "exit_date": date(2025, 7, 21), 
     "entry_price": 2.10, "exit_price": 2.95, "shares": 304.07298018, "brokerage_fee": 6.0, "notes": "Fat profit"},
    
    # SMCI Trade
    {"symbol": "SMCI", "entry_date": date(2025, 7, 21), "exit_date": date(2025, 7, 25), 
     "entry_price": 53.48, "exit_price": 53.76, "shares": 34.90582973, "brokerage_fee": 6.0, "notes": "meh"},
    
    # NVDA Trade 2
    {"symbol": "NVDA", "entry_date": date(2025, 7, 28), "exit_date": date(2025, 7, 31), 
     "entry_price": 174.65, "exit_price": 177.99, "shares": 10.71069884, "brokerage_fee": 6.0, "notes": "Clean 1.5% scalp, smooth"},
    
    # AMD Trade 2
    {"symbol": "AMD", "entry_date": date(2025, 8, 1), "exit_date": date(2025, 8, 5), 
     "entry_price": 171.29, "exit_price": 175.86, "shares": 11.09479028, "brokerage_fee": 6.0, "notes": "Tight scalp, good read"},
    
    # CRWD Trade 1
    {"symbol": "CRWD", "entry_date": date(2025, 8, 6), "exit_date": date(2025, 8, 7), 
     "entry_price": 444.45, "exit_price": 439.96, "shares": 4.37639567, "brokerage_fee": 6.0, "notes": ""},
    
    # TSM Trade
    {"symbol": "TSM", "entry_date": date(2025, 8, 11), "exit_date": date(2025, 8, 14), 
     "entry_price": 244.23, "exit_price": 236.92, "shares": 7.85905351, "brokerage_fee": 6.0, "notes": "fuck you"},
    
    # AMZN Trade 1
    {"symbol": "AMZN", "entry_date": date(2025, 8, 18), "exit_date": date(2025, 8, 20), 
     "entry_price": 229.34, "exit_price": 224.99, "shares": 10.89762932, "brokerage_fee": 6.0, "notes": "yay another L"},
    
    # NVDA Trade 3
    {"symbol": "NVDA", "entry_date": date(2025, 8, 20), "exit_date": date(2025, 8, 22), 
     "entry_price": 170.05, "exit_price": 171.57, "shares": 14.38309803, "brokerage_fee": 6.0, "notes": "set stop loss too tight"},
    
    # AMD Trade 3
    {"symbol": "AMD", "entry_date": date(2025, 8, 22), "exit_date": date(2025, 9, 5), 
     "entry_price": 168.23, "exit_price": 150.72, "shares": 14.63294299, "brokerage_fee": 6.0, "notes": "awesome. should've just let myself get wicked out"},
    
    # VST Trade
    {"symbol": "VST", "entry_date": date(2025, 9, 5), "exit_date": date(2025, 9, 5), 
     "entry_price": 178.77, "exit_price": 186.54, "shares": 12.30340148, "brokerage_fee": 6.0, "notes": "Clean scalp"},
    
    # AMZN Trade 2
    {"symbol": "AMZN", "entry_date": date(2025, 9, 5), "exit_date": date(2025, 9, 8), 
     "entry_price": 232.75, "exit_price": 236.53, "shares": 12.61347539, "brokerage_fee": 6.0, "notes": "Quick scalp"},
    
    # MU Trade
    {"symbol": "MU", "entry_date": date(2025, 9, 9), "exit_date": date(2025, 9, 10), 
     "entry_price": 133.48, "exit_price": 139.07, "shares": 22.30596925, "brokerage_fee": 6.0, "notes": "Tight scalp, smooth"},
    
    # CRWD Trade 2 (split sells combined)
    {"symbol": "CRWD", "entry_date": date(2025, 9, 10), "exit_date": date(2025, 9, 15), 
     "entry_price": 429.89, "exit_price": 445.35, "shares": 7.20213841, "brokerage_fee": 6.0, "notes": "Split into 2 sells"},
    
    # PLTR Trade
    {"symbol": "PLTR", "entry_date": date(2025, 9, 16), "exit_date": date(2025, 9, 17), 
     "entry_price": 170.16, "exit_price": 163.91, "shares": 22.65980004, "brokerage_fee": 6.0, "notes": "Stop hit"},
    
    # TSLA Trade 1
    {"symbol": "TSLA", "entry_date": date(2025, 9, 17), "exit_date": date(2025, 9, 17), 
     "entry_price": 419.10, "exit_price": 426.24, "shares": 8.84809252, "brokerage_fee": 6.0, "notes": "Clean scalp"},
    
    # INTC Trade
    {"symbol": "INTC", "entry_date": date(2025, 9, 18), "exit_date": date(2025, 9, 18), 
     "entry_price": 31.29, "exit_price": 32.24, "shares": 120.34338165, "brokerage_fee": 6.0, "notes": "Decent scalp"},
    
    # AMZN Trade 3
    {"symbol": "AMZN", "entry_date": date(2025, 9, 19), "exit_date": date(2025, 9, 22), 
     "entry_price": 233.72, "exit_price": 229.78, "shares": 16.57551677, "brokerage_fee": 6.0, "notes": "Stop hit"},
    
    # TSLA Trade 2
    {"symbol": "TSLA", "entry_date": date(2025, 9, 22), "exit_date": date(2025, 9, 23), 
     "entry_price": 437.36, "exit_price": 434.09, "shares": 8.69458848, "brokerage_fee": 6.0, "notes": "Lossy scalp"},
    
    # AMD Trade 4
    {"symbol": "AMD", "entry_date": date(2025, 9, 23), "exit_date": date(2025, 9, 25), 
     "entry_price": 161.98, "exit_price": 155.79, "shares": 23.26405523, "brokerage_fee": 6.0, "notes": "Stop hit"},
]

for trade_data in trades_data:
    trade = Trade(user_id=user.id, **trade_data)
    calculate_trade_metrics(trade)
    db.add(trade)

db.commit()
db.close()

print("✅ Seed data added successfully!")
print("📊 Added 5 deposits and 25 trades (24 closed + 1 open)")
print("💰 Total deposited: $3,560.39 USD")
print("🔑 Login with: test@test.com / test123")