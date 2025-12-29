# Santa’s Smart Budget App — Backend

Node.js + Express API that persists transactions to a JSON file and exposes an optional AI budgeting advisor.

## Requirements
- Node.js 18+ and npm

## Getting started
1. Install dependencies
   ```powershell
   cd backend
   npm install
   ```
2. Start the server (default: http://localhost:4000)
   ```powershell
   npm start
   ```

### Environment variables (PowerShell examples)
- Change port
  ```powershell
  $env:PORT = '4001'; npm start
  ```
- Use a custom data file location
  ```powershell
  $env:DATA_FILE = 'C:\\path\\to\\transactions.json'; npm start
  ```
- Enable OpenAI‑powered advisor (optional)
  ```powershell
  $env:OPENAI_API_KEY = 'sk-...'; npm start
  ```

## Data persistence
- Default file: `backend/data/transactions.json` (created automatically on first run)
- Atomic writes via a temp file then rename
- You can override the file path with `DATA_FILE`

## API Endpoints
Base URL: `http://localhost:{PORT}` (4000 by default)

Health
- `GET /health` → `{ status: "ok" }`

Transactions (JSON file–backed)
- `GET /transactions` → `Transaction[]`
- `POST /transactions` → create a transaction
  - Body: `{ type: 'income'|'expense', amount: number, category: string, description?: string, date?: ISO }`
  - Server assigns `id` and normalizes `date` to ISO
- `PUT /transactions/:id` → update an existing transaction (partial updates allowed)
- `DELETE /transactions/:id` → removes the transaction (204 on success)

Advisor (heuristic or OpenAI if configured)
- `POST /advisor` → `{ suggestion: string }`
  - Body: an array of transactions
  - Without `OPENAI_API_KEY` the server returns a deterministic heuristic suggestion

## CORS
- Enabled with `cors({ origin: true })` for local development
- Frontend dev server at `http://localhost:5173` can call this API

## Testing
```powershell
npm test
```
- Uses Mocha + Chai + Undici
- Tests cover `/health`, `/advisor`, and transactions CRUD with a temporary data file

## Example requests
```bash
curl http://localhost:4000/health

curl http://localhost:4000/transactions

curl -X POST http://localhost:4000/transactions \
  -H "Content-Type: application/json" \
  -d '{"type":"expense","amount":25,"category":"Decorations","description":"Lights"}'
```
