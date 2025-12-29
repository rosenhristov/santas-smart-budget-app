import { describe, it, before, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import { fetch } from 'undici';
import app from '../app.js';

// Ensure OpenAI is not called during tests
before(() => {
  delete process.env.OPENAI_API_KEY;
});

let server;
let baseUrl;

beforeEach(async () => {
  await new Promise(resolve => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

afterEach(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }
});

describe('Health endpoint', () => {
  it('GET /health returns status ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).to.equal(200);
    const body = await res.json();
    expect(body).to.deep.equal({ status: 'ok' });
  });
});

describe('Advisor endpoint (heuristic)', () => {
  it('returns decoration overspend suggestion when >30% decorations', async () => {
    const transactions = [
      { id: '1', type: 'expense', category: 'Decorations', amount: 400 },
      { id: '2', type: 'expense', category: 'Gifts', amount: 500 },
      { id: '3', type: 'expense', category: 'Food', amount: 100 }
    ];

    // decorations = 400, total = 1000, ratio = 0.4
    const res = await fetch(`${baseUrl}/advisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactions)
    });

    expect(res.status).to.equal(200);
    const body = await res.json();
    expect(typeof body.suggestion).to.equal('string');
    expect(body.suggestion).to.contain('30%');
    expect(body.suggestion).to.contain('Decorations');
  });

  it('returns balanced suggestion when decorations <=30% of expenses', async () => {
    const transactions = [
      { id: '1', type: 'expense', category: 'Decorations', amount: 200 },
      { id: '2', type: 'expense', category: 'Gifts', amount: 500 },
      { id: '3', type: 'expense', category: 'Food', amount: 300 }
    ];

    // decorations = 200, total = 1000, ratio = 0.2
    const res = await fetch(`${baseUrl}/advisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactions)
    });

    expect(res.status).to.equal(200);
    const body = await res.json();
    expect(typeof body.suggestion).to.equal('string');
    expect(body.suggestion).to.contain('balanced');
  });
});
