import React, { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import WeeklyReport from './components/WeeklyReport';
import './App.css'; // We'll update index.css or App.css for styling

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Personal Finance Tracker</h1>
      </header>
      <main>
        <div className="dashboard">
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
          <WeeklyReport refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  );
}

export default App;
