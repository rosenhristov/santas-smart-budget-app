# Santa’s Smart Budget App — Frontend

React + Vite app that connects to the backend API to manage holiday income and expenses. It shows a live summary, a pie chart of expenses by category, and an AI budgeting advisor button.

## Requirements
- Node.js 18+ and npm

## Getting started
1. Install dependencies
   ```powershell
   cd frontend
   npm install
   ```
2. Start the dev server (default: http://localhost:5173)
   ```powershell
   npm run dev
   ```
3. Open the URL printed by Vite. Ensure the backend is running at `http://localhost:4000`.

## Backend connection
- API URLs are hardcoded for local development:
  - Transactions: `http://localhost:4000/transactions`
  - Advisor: `http://localhost:4000/advisor`
- If the backend runs on a different host/port, update these in:
  - `src\App.jsx`
  - `src\components\Advisor.jsx`

## Available scripts
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

## Testing
Run tests with Vitest and Testing Library:
```powershell
npm test
```
- Axios calls are mocked; the backend is not required for tests.

## Features
- Add transactions (income/expense) with category and description
- View summary of income, expenses, and balance
- Visualize expenses by category using Recharts (pie chart)
- Request budgeting advice via the Advisor button (`POST /advisor`)

## Troubleshooting
- Start the backend first at `http://localhost:4000`.
- If using a different API port, update URLs in `App.jsx` and `components\Advisor.jsx`.
- CORS is enabled on the backend for dev (`cors({ origin: true })`).
- Empty chart? Add at least one expense transaction.

## Production build
```powershell
npm run build
npm run preview  # preview the production build locally
```

For deployment with a different API host, consider using a Vite environment variable like `VITE_API_BASE` and reading it via `import.meta.env`. The current project keeps fixed URLs for simplicity.
