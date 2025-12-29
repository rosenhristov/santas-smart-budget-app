export default function Summary({ transactions }) {
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);

    return (
        <div>
            <p>Total Income: {income}</p>
            <p>Total Expenses: {expenses}</p>
            <p>Balance: {income - expenses}</p>
        </div>
    );
}
