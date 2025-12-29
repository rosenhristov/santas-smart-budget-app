// Express server (ESM)
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// POST /advisor
app.post('/advisor', async (req, res) => {
  const transactions = Array.isArray(req.body) ? req.body : [];

  // Simple heuristic suggestion
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  const decorations = transactions
    .filter(t => t.type === 'expense' && t.category === 'Decorations')
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  let suggestion = '';
  if (totalExpenses > 0 && decorations / totalExpenses > 0.3) {
    suggestion = 'You have spent more than 30% of your budget on Decorations. Consider reallocating some to Gifts.';
  } else {
    suggestion = 'Your spending looks balanced. Keep up the good work!';
  }

  // Optional: AI-powered suggestion
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const openai = new OpenAI({ apiKey });
      const prompt = `Analyze the following holiday transactions and provide one actionable, friendly budgeting tip in 1-2 sentences.\n${JSON.stringify(transactions, null, 2)}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a concise budgeting assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 120
      });

      const content = response.choices?.[0]?.message?.content?.trim();
      if (content) suggestion = content;
    } catch (err) {
      console.error('OpenAI error:', err.message);
      // keep heuristic suggestion on error
    }
  }

  res.json({ suggestion });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
