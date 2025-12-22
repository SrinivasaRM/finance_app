from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from models import Transaction, TransactionCreate, TransactionDB
from database import SessionLocal, engine, Base
import uuid
from datetime import datetime, timedelta

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

import os

# CORS configuration
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Personal Finance App Backend Running with SQLite"}

@app.post("/transactions", response_model=Transaction)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = TransactionDB(
        id=str(uuid.uuid4()),
        amount=transaction.amount,
        type=transaction.type,
        description=transaction.description,
        date=transaction.date
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions", response_model=List[Transaction])
def get_transactions(db: Session = Depends(get_db)):
    return db.query(TransactionDB).all()

@app.get("/reports/weekly")
def get_weekly_report(db: Session = Depends(get_db)):
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    # Query transactions from the last 7 days from DB
    # Note: For production valid date comparison, ensure consistent UTC usage
    transactions = db.query(TransactionDB).filter(TransactionDB.date >= seven_days_ago).all()
    
    weekly_credit = 0.0
    weekly_debit = 0.0
    
    for t in transactions:
        if t.type == 'credit':
            weekly_credit += t.amount
        elif t.type == 'debit':
            weekly_debit += t.amount
                
    balance = weekly_credit - weekly_debit
    
    return {
        "start_date": seven_days_ago.isoformat(),
        "end_date": datetime.utcnow().isoformat(),
        "total_credit": weekly_credit,
        "total_debit": weekly_debit,
        "net_balance": balance
    }
