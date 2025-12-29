// Express app (exported for testing)
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import path from 'path';
import { readTransactions, writeTransactions, ensureDataFile } from './lib/storage.js';
import { v4 as uuid } from 'uuid';

export const createApp = (options = {}) => {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(bodyParser.json());

  // Resolve data file path
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const defaultDataFile = path.join(__dirname, 'data', 'transactions.json');
  const dataFile = options.dataFile || process.env.DATA_FILE || defaultDataFile;
  ensureDataFile(dataFile).catch(() => {/* noop */});

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

  // ---------------------------
  // Transactions CRUD (JSON file)
  // ---------------------------

  // GET all transactions
  app.get('/transactions', async (req, res) => {
    try {
      const all = await readTransactions(dataFile);
      res.json(all);
    } catch (err) {
      console.error('GET /transactions error:', err);
      res.status(500).json({ error: 'Failed to read transactions' });
    }
  });

  // POST create transaction
  app.post('/transactions', async (req, res) => {
    try {
      const { type, amount, category, description, date } = req.body || {};

      if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ error: 'Invalid type' });
      }
      const numAmount = Number(amount);
      if (!Number.isFinite(numAmount) || numAmount < 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
      if (typeof category !== 'string' || category.length === 0) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      if (description != null && typeof description !== 'string') {
        return res.status(400).json({ error: 'Invalid description' });
      }
      const isoDate = date ? new Date(date).toISOString() : new Date().toISOString();

      const tx = { id: uuid(), type, amount: numAmount, category, description: description || '', date: isoDate };

      const all = await readTransactions(dataFile);
      all.unshift(tx);
      await writeTransactions(dataFile, all);
      res.status(201).json(tx);
    } catch (err) {
      console.error('POST /transactions error:', err);
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  });

  // PUT update transaction
  app.put('/transactions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { type, amount, category, description, date } = req.body || {};

      const all = await readTransactions(dataFile);
      const idx = all.findIndex(t => t.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });

      const prev = all[idx];
      const next = { ...prev };
      if (type !== undefined) {
        if (type !== 'income' && type !== 'expense') return res.status(400).json({ error: 'Invalid type' });
        next.type = type;
      }
      if (amount !== undefined) {
        const numAmount = Number(amount);
        if (!Number.isFinite(numAmount) || numAmount < 0) return res.status(400).json({ error: 'Invalid amount' });
        next.amount = numAmount;
      }
      if (category !== undefined) {
        if (typeof category !== 'string' || category.length === 0) return res.status(400).json({ error: 'Invalid category' });
        next.category = category;
      }
      if (description !== undefined) {
        if (description != null && typeof description !== 'string') return res.status(400).json({ error: 'Invalid description' });
        next.description = description || '';
      }
      if (date !== undefined) {
        const d = new Date(date);
        if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid date' });
        next.date = d.toISOString();
      }

      all[idx] = next;
      await writeTransactions(dataFile, all);
      res.json(next);
    } catch (err) {
      console.error('PUT /transactions/:id error:', err);
      res.status(500).json({ error: 'Failed to update transaction' });
    }
  });

  // DELETE transaction
  app.delete('/transactions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const all = await readTransactions(dataFile);
      const next = all.filter(t => t.id !== id);
      if (next.length === all.length) return res.status(404).json({ error: 'Not found' });
      await writeTransactions(dataFile, next);
      res.status(204).send();
    } catch (err) {
      console.error('DELETE /transactions/:id error:', err);
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
  });

  return app;
};

const app = createApp();
export default app;
