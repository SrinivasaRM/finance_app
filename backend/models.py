from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
from pydantic import BaseModel
from typing import Literal
from datetime import datetime
import uuid

# SQLAlchemy Model
class TransactionDB(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    amount = Column(Float)
    type = Column(String) # 'credit' or 'debit'
    description = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)

# Pydantic Schemas
class TransactionBase(BaseModel):
    amount: float
    type: Literal['credit', 'debit']
    description: str | None = None
    date: datetime = datetime.now()

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: str

    class Config:
        orm_mode = True
