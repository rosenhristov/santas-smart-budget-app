export default function TransactionList({ transactions }) {
    return (
        <ul>
            {transactions.map(t => (
                <li key={t.id}>
                    {t.type.toUpperCase()} | {t.category} | {t.amount}
                </li>
            ))}
        </ul>
    );
}
