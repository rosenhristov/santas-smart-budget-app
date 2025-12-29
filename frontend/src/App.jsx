import { useEffect, useState } from "react";
import axios from "axios";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Summary from "./components/Summary";
import ExpenseChart from "./components/ExpenseChart";
import Advisor from "./components/Advisor";

export default function App() {
  const [transactions, setTransactions] = useState([]);

  // Load initial transactions from backend
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get("http://localhost:4000/transactions");
        if (!cancelled) setTransactions(res.data || []);
      } catch (e) {
        console.error("Failed to load transactions:", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleAdd = async (tx) => {
    try {
      const res = await axios.post("http://localhost:4000/transactions", tx);
      const saved = res.data;
      setTransactions((prev) => [saved, ...prev]);
    } catch (e) {
      console.error("Failed to save transaction:", e);
    }
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
