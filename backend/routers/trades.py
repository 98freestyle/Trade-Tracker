from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from database import get_db
import models
import auth

router = APIRouter(prefix="/api/trades", tags=["Trades"])

# Pydantic schemas
class TradeCreate(BaseModel):
    symbol: str
    entry_date: date
    exit_date: Optional[date] = None
    entry_price: float
    exit_price: Optional[float] = None
    shares: float
    notes: Optional[str] = None
    brokerage_fee: Optional[float] = None

class TradeUpdate(BaseModel):
    symbol: Optional[str] = None
    entry_date: Optional[date] = None
    exit_date: Optional[date] = None
    entry_price: Optional[float] = None
    exit_price: Optional[float] = None
    shares: Optional[float] = None
    notes: Optional[str] = None
    brokerage_fee: Optional[float] = None

class TradeResponse(BaseModel):
    id: int
    symbol: str
    entry_date: date
    exit_date: Optional[date]
    entry_price: float
    exit_price: Optional[float]
    shares: float
    total_cost: Optional[float]
    profit_loss: Optional[float]
    profit_loss_percent: Optional[float]
    notes: Optional[str]
    brokerage_fee: Optional[float]
    
    class Config:
        from_attributes = True

def calculate_trade_metrics(trade: models.Trade):
    """Calculate total cost, P&L, and P&L percentage for a trade"""
    trade.total_cost = trade.entry_price * trade.shares
    
    if trade.exit_price:
        trade.profit_loss = (trade.exit_price - trade.entry_price) * trade.shares
        trade.profit_loss_percent = ((trade.exit_price - trade.entry_price) / trade.entry_price) * 100
    else:
        trade.profit_loss = None
        trade.profit_loss_percent = None

@router.post("/", response_model=TradeResponse, status_code=status.HTTP_201_CREATED)
def create_trade(
    trade_data: TradeCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new trade"""
    new_trade = models.Trade(
        user_id=current_user.id,
        **trade_data.dict()
    )
    
    # Calculate metrics
    calculate_trade_metrics(new_trade)
    
    db.add(new_trade)
    db.commit()
    db.refresh(new_trade)
    
    return new_trade

@router.get("/", response_model=List[TradeResponse])
def get_trades(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all trades for current user"""
    trades = db.query(models.Trade).filter(models.Trade.user_id == current_user.id).all()
    return trades

@router.get("/{trade_id}", response_model=TradeResponse)
def get_trade(
    trade_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific trade"""
    trade = db.query(models.Trade).filter(
        models.Trade.id == trade_id,
        models.Trade.user_id == current_user.id
    ).first()
    
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    
    return trade

@router.put("/{trade_id}", response_model=TradeResponse)
def update_trade(
    trade_id: int,
    trade_data: TradeUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update a trade"""
    trade = db.query(models.Trade).filter(
        models.Trade.id == trade_id,
        models.Trade.user_id == current_user.id
    ).first()
    
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    
    # Update fields
    for field, value in trade_data.dict(exclude_unset=True).items():
        setattr(trade, field, value)
    
    # Recalculate metrics
    calculate_trade_metrics(trade)
    
    db.commit()
    db.refresh(trade)
    
    return trade

@router.delete("/{trade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trade(
    trade_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a trade"""
    trade = db.query(models.Trade).filter(
        models.Trade.id == trade_id,
        models.Trade.user_id == current_user.id
    ).first()
    
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    
    db.delete(trade)
    db.commit()
    
    return None