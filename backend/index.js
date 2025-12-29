// At the top
const { Configuration, OpenAIApi } = require("openai");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI client (if available)
let openai;
if (OPENAI_API_KEY) {
    const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
    openai = new OpenAIApi(configuration);
}

// POST /advisor
app.post("/advisor", async (req, res) => {
    const transactions = req.body; // array of transactions

    // Simple heuristic suggestion
    const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);

    const decorations = transactions
        .filter(t => t.type === "expense" && t.category === "Decorations")
        .reduce((s, t) => s + t.amount, 0);

    let suggestion = "";

    if (totalExpenses > 0 && decorations / totalExpenses > 0.3) {
        suggestion = "You have spent more than 30% of your budget on Decorations. Consider reallocating some to Gifts.";
    } else {
        suggestion = "Your spending looks balanced. Keep up the good work!";
    }

    // Optional: AI-powered suggestion
    if (openai) {
        try {
            const prompt = `
Analyze the following holiday transactions and provide one actionable budgeting tip:
${JSON.stringify(transactions, null, 2)}
      `;
            const response = await openai.createChatCompletion({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
            });
            suggestion = response.data.choices[0].message.content.trim();
        } catch (err) {
            console.error("OpenAI error:", err.message);
        }
    }

    res.json({ suggestion });
});
