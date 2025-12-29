import { describe, it, before, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import { fetch } from 'undici';
import { fileURLToPath } from 'url';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { createApp } from '../app.js';

const tmpFile = () => path.join(os.tmpdir(), `ssba-transactions-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);

describe('Transactions CRUD (file-backed)', () => {
  let server;
  let baseUrl;
  let dataFile;

  beforeEach(async () => {
    dataFile = tmpFile();
    const app = createApp({ dataFile });
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
    try { await fs.unlink(dataFile); } catch (_) {}
  });

  it('GET /transactions returns empty array initially', async () => {
    const res = await fetch(`${baseUrl}/transactions`);
    expect(res.status).to.equal(200);
    const body = await res.json();
    expect(body).to.deep.equal([]);
  });

  it('POST creates transaction and GET returns it', async () => {
    const payload = { type: 'income', amount: 1000, category: 'Gifts', description: 'Bonus' };
    const resPost = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    expect(resPost.status).to.equal(201);
    const created = await resPost.json();
    expect(created).to.include({ type: 'income', amount: 1000, category: 'Gifts', description: 'Bonus' });
    expect(created).to.have.property('id');
    expect(created).to.have.property('date');

    const resGet = await fetch(`${baseUrl}/transactions`);
    expect(resGet.status).to.equal(200);
    const list = await resGet.json();
    expect(list).to.be.an('array').with.lengthOf(1);
    expect(list[0].id).to.equal(created.id);
  });

  it('PUT updates a transaction and persists changes', async () => {
    const create = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'expense', amount: 200, category: 'Decorations', description: 'Lights' })
    });
    const tx = await create.json();

    const update = await fetch(`${baseUrl}/transactions/${tx.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 250, description: 'LED Lights' })
    });
    expect(update.status).to.equal(200);
    const updated = await update.json();
    expect(updated.amount).to.equal(250);
    expect(updated.description).to.equal('LED Lights');

    const resGet = await fetch(`${baseUrl}/transactions`);
    const list = await resGet.json();
    expect(list[0].amount).to.equal(250);
  });

  it('DELETE removes a transaction', async () => {
    const create = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'expense', amount: 50, category: 'Food & Dinner', description: 'Cookies' })
    });
    const tx = await create.json();

    const del = await fetch(`${baseUrl}/transactions/${tx.id}`, { method: 'DELETE' });
    expect(del.status).to.equal(204);

    const resGet = await fetch(`${baseUrl}/transactions`);
    const list = await resGet.json();
    expect(list).to.deep.equal([]);
  });

  it('Validation: rejects invalid payloads', async () => {
    const badType = await fetch(`${baseUrl}/transactions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'other', amount: 10, category: 'Gifts' })
    });
    expect(badType.status).to.equal(400);

    const badAmount = await fetch(`${baseUrl}/transactions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'income', amount: -5, category: 'Gifts' })
    });
    expect(badAmount.status).to.equal(400);

    const badCategory = await fetch(`${baseUrl}/transactions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'income', amount: 10, category: '' })
    });
    expect(badCategory.status).to.equal(400);
  });
});
