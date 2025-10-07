from database import SessionLocal
from models import User, Trade, Deposit
from auth import hash_password
from datetime import date

db = SessionLocal()

# Create test user
user = User(
    email="test@test.com",
    hashed_password=hash_password("test123")
)
db.add(user)
db.commit()
db.refresh(user)

# Add deposit
deposit = Deposit(
    user_id=user.id,
    amount=1000.0,
    deposit_date=date(2025, 6, 13),
    notes="Initial deposit"
)
db.add(deposit)

# Add trades
trades = [
    Trade(
        user_id=user.id,
        symbol="NVDA",
        entry_date=date(2025, 6, 20),
        exit_date=date(2025, 6, 25),
        entry_price=170.0,
        exit_price=180.0,
        shares=10.0,
        total_cost=1700.0,
        profit_loss=100.0,
        profit_loss_percent=5.88
    ),
    Trade(
        user_id=user.id,
        symbol="AMD",
        entry_date=date(2025, 7, 1),
        exit_date=date(2025, 7, 5),
        entry_price=150.0,
        exit_price=140.0,
        shares=5.0,
        total_cost=750.0,
        profit_loss=-50.0,
        profit_loss_percent=-6.67
    )
]

for trade in trades:
    db.add(trade)

db.commit()
db.close()

print("✅ Seed data added successfully!")
print("Login with: test@test.com / test123")