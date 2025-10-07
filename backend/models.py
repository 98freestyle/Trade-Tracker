from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    trades = relationship("Trade", back_populates="owner")
    deposits = relationship("Deposit", back_populates="owner")


class Trade(Base):
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Trade details
    symbol = Column(String, nullable=False, index=True)
    entry_date = Column(Date, nullable=False)
    exit_date = Column(Date)
    entry_price = Column(Float, nullable=False)
    exit_price = Column(Float)
    shares = Column(Float, nullable=False)
    
    # Calculated fields
    total_cost = Column(Float)  # entry_price * shares
    profit_loss = Column(Float)  # (exit_price - entry_price) * shares
    profit_loss_percent = Column(Float)  # (exit_price - entry_price) / entry_price * 100
    
    # Notes
    notes = Column(Text)
    brokerage_fee = Column(Float)  # Transaction fees
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="trades")


class Deposit(Base):
    __tablename__ = "deposits"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    amount = Column(Float, nullable=False)
    deposit_date = Column(Date, nullable=False)
    notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="deposits")
