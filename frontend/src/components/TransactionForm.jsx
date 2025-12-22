import React, { useState } from 'react';
import axios from 'axios';

const TransactionForm = ({ onTransactionAdded }) => {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('debit');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/transactions', {
                amount: parseFloat(amount),
                type,
                description,
                date: new Date().toISOString() // Or let backend handle it, but models.py has default
            });
            // Clear form
            setAmount('');
            setDescription('');
            if (onTransactionAdded) onTransactionAdded();
        } catch (error) {
            console.error("Error adding transaction", error);
        }
    };

    return (
        <div className="card">
            <h3>Add Transaction</h3>
            <form onSubmit={handleSubmit} className="transaction-form">
                <div className="form-group">
                    <label>Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0.01"
                        step="0.01"
                    />
                </div>
                <div className="form-group">
                    <label>Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="debit">Debit</option>
                        <option value="credit">Credit</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit">Add Transaction</button>
            </form>
        </div>
    );
};

export default TransactionForm;
