import { useState } from "react";
import { CATEGORIES } from "../data/categories";
import { v4 as uuid } from "uuid";

export default function TransactionForm({ onAdd }) {
    const [type, setType] = useState("expense");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [description, setDescription] = useState("");

    const submit = (e) => {
        e.preventDefault();

        onAdd({
            id: uuid(),
            type,
            amount: Number(amount),
            category,
            description,
            date: new Date().toISOString()
        });

        setAmount("");
        setDescription("");
    };

    return (
        <form onSubmit={submit}>
            <select value={type} onChange={e => setType(e.target.value)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>

            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
            />

            <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>

            <input
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />

            <button>Add</button>
        </form>
    );
}
