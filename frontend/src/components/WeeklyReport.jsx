import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeeklyReport = ({ refreshTrigger }) => {
    const [report, setReport] = useState(null);

    useEffect(() => {
        fetchReport();
    }, [refreshTrigger]);

    const fetchReport = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/reports/weekly');
            setReport(response.data);
        } catch (error) {
            console.error("Error fetching report", error);
        }
    };

    if (!report) return <div>Loading report...</div>;

    return (
        <div className="card">
            <h3>Weekly Report</h3>
            <div className="report-grid">
                <div className="report-item">
                    <span className="label">Total Credit</span>
                    <span className="value credit">+${report.total_credit.toFixed(2)}</span>
                </div>
                <div className="report-item">
                    <span className="label">Total Debit</span>
                    <span className="value debit">-${report.total_debit.toFixed(2)}</span>
                </div>
                <div className="report-item">
                    <span className="label">Net Balance</span>
                    <span className={`value ${report.net_balance >= 0 ? 'credit' : 'debit'}`}>
                        ${report.net_balance.toFixed(2)}
                    </span>
                </div>
            </div>
            <p className="date-range">
                {new Date(report.start_date).toLocaleDateString()} - {new Date(report.end_date).toLocaleDateString()}
            </p>
        </div>
    );
};

export default WeeklyReport;
