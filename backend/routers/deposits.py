from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from database import get_db
import models
import auth

router = APIRouter(prefix="/api/deposits", tags=["Deposits"])

# Pydantic schemas
class DepositCreate(BaseModel):
    amount: float
    deposit_date: date
    notes: Optional[str] = None

class DepositResponse(BaseModel):
    id: int
    amount: float
    deposit_date: date
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/", response_model=DepositResponse, status_code=status.HTTP_201_CREATED)
def create_deposit(
    deposit_data: DepositCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new deposit"""
    new_deposit = models.Deposit(
        user_id=current_user.id,
        amount=deposit_data.amount,
        deposit_date=deposit_data.deposit_date,
        notes=deposit_data.notes
    )
    
    db.add(new_deposit)
    db.commit()
    db.refresh(new_deposit)
    
    return new_deposit

@router.get("/", response_model=List[DepositResponse])
def get_deposits(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all deposits for current user"""
    deposits = db.query(models.Deposit).filter(
        models.Deposit.user_id == current_user.id
    ).order_by(models.Deposit.deposit_date.desc()).all()
    return deposits

@router.delete("/{deposit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deposit(
    deposit_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a deposit"""
    deposit = db.query(models.Deposit).filter(
        models.Deposit.id == deposit_id,
        models.Deposit.user_id == current_user.id
    ).first()
    
    if not deposit:
        raise HTTPException(status_code=404, detail="Deposit not found")
    
    db.delete(deposit)
    db.commit()
    
    return None