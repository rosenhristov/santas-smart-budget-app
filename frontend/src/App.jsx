import { useState, useEffect } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Summary from "./components/Summary";
import ExpenseChart from "./components/ExpenseChart";
import axios from "axios";

const API_URL = "http://localhost:4000/transactions";

export default function App() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        axios.get(API_URL).then(res => setTransactions(res.data));
    }, []);

    const addTransaction = (t) => {
        axios.post(API_URL, t).then(res => {
            setTransactions([...transactions, res.data]);
        });
    };

    return (
        <div>
            <h1>🎅 Santa’s Smart Budget</h1>

            <TransactionForm onAdd={addTransaction} />

            <Summary transactions={transactions} />
            <ExpenseChart transactions={transactions} />
            <TransactionList transactions={transactions} />
        </div>
    );
}
