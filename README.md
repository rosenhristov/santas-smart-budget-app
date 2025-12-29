# 🎅 Santa’s Smart Budget App

A Christmas-themed budget management application built using the
**Breakthrough Method for Agile Development (BMAD)** and an **AI-First workflow**.

## 🎯 Goal
Help Santa (and everyday users) manage income and expenses during the holiday season.

## 🧠 Methodology
This project strictly follows BMAD:
1. Analysis
2. Planning
3. Solutioning
4. Implementation

Each phase is documented and committed separately.

## 🛠 Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Storage: JSON file persistence on the backend (data/transactions.json)
- Charts: Recharts or Chart.js
- AI: OpenAI (optional) for Advisor endpoint

## 📄 Documentation
- `docs/analysis.md`
- `docs/planning.md`
- `docs/solutioning.md`
- `prompts.md`
- `summary.md`

## ▶️ How to run

Backend (Express + JSON file storage):
1. In PowerShell:
   - cd backend
   - npm i
   - npm start
2. The API runs on http://localhost:4000
3. Endpoints:
   - GET /health
   - GET /transactions
   - POST /transactions
   - PUT /transactions/:id
   - DELETE /transactions/:id
   - POST /advisor (optional AI advice)
4. Persistence: Transactions are stored in `backend/data/transactions.json` (created automatically). Override path via env var `DATA_FILE` if needed.
5. Optional: Set `OPENAI_API_KEY` in environment to enable AI-generated advice; otherwise heuristic advice is used.

Environment variables (PowerShell examples):
- Enable OpenAI-powered advisor
  - $env:OPENAI_API_KEY = "YOUR_KEY"; npm start
- Custom data file location
  - $env:DATA_FILE = "C:\\path\\to\\transactions.json"; npm start

CORS and Advisor endpoint URL:
- CORS is enabled in development (origin: true). Browser apps on http://localhost:5173 can call the API at http://localhost:4000.
- Advisor endpoint from the frontend uses: POST http://localhost:4000/advisor with the transactions array as JSON.

Frontend (React + Vite):
1. In a new terminal:
   - cd frontend
   - npm i
   - npm run dev
2. Open the shown localhost URL (e.g., http://localhost:5173). The app will load transactions from the backend and save new ones via the API.
   - Ensure the backend is running on http://localhost:4000. The frontend in this project calls fixed URLs (http://localhost:4000/transactions and http://localhost:4000/advisor).

## 🧪 Tests
- Backend: `cd backend; npm test` (Mocha + Chai). Includes tests for `/health`, `/advisor`, and transactions CRUD.
