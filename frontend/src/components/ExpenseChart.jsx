import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function ExpenseChart({ transactions }) {
    const data = Object.values(
        transactions
            .filter(t => t.type === "expense")
            .reduce((acc, t) => {
                acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
                acc[t.category].value += t.amount;
                return acc;
            }, {})
    );

    return (
        <PieChart width={300} height={300}>
            <Pie data={data} dataKey="value" nameKey="name" />
            <Tooltip />
        </PieChart>
    );
}
