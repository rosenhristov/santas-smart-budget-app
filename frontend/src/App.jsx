import { useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Summary from "./components/Summary";
import ExpenseChart from "./components/ExpenseChart";

export default function App() {
    const [transactions, setTransactions] = useState([]);

    return (
        <div>
            <h1>🎅 Santa’s Smart Budget</h1>

            <TransactionForm
                onAdd={t => setTransactions([...transactions, t])}
            />

            <Summary transactions={transactions} />
            <ExpenseChart transactions={transactions} />
            <TransactionList transactions={transactions} />
        </div>
    );
}
