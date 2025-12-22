from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Personal Finance App Backend Running with SQLite"}

def test_create_transaction():
    transaction_data = {
        "amount": 100.50,
        "type": "credit",
        "description": "Salary",
        "date": "2023-10-27T10:00:00"
    }
    response = client.post("/transactions", json=transaction_data)
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 100.50
    assert data["type"] == "credit"
    assert "id" in data

def test_get_transactions():
    response = client.get("/transactions")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
