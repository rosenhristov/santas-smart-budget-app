import { useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Summary from "./components/Summary";
import ExpenseChart from "./components/ExpenseChart";
import Advisor from "./components/Advisor";

export default function App() {
  const [transactions, setTransactions] = useState([]);

  const handleAdd = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1>Santa's Smart Budget</h1>

      <section style={{ marginBottom: 16 }}>
        <h2>Add Transaction</h2>
        <TransactionForm onAdd={handleAdd} />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <h2>Summary</h2>
          <Summary transactions={transactions} />

          <h2>Transactions</h2>
          <TransactionList transactions={transactions} />
        </div>

        <div>
          <h2>Expenses Breakdown</h2>
          <ExpenseChart transactions={transactions} />
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <Advisor transactions={transactions} />
      </section>
    </div>
  );
}
