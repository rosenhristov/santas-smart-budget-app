const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const app = express();
const PORT = 4000;
const DATA_FILE = "data.json";

app.use(cors());
app.use(bodyParser.json());

// Helper: read transactions
function readTransactions() {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE);
    return JSON.parse(raw);
}

// Helper: write transactions
function writeTransactions(transactions) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(transactions, null, 2));
}

// GET all transactions
app.get("/transactions", (req, res) => {
    const transactions = readTransactions();
    res.json(transactions);
});

// POST new transaction
app.post("/transactions", (req, res) => {
    const transaction = { id: uuid(), ...req.body };
    const transactions = readTransactions();
    transactions.push(transaction);
    writeTransactions(transactions);
    res.status(201).json(transaction);
});

// PUT update transaction
app.put("/transactions/:id", (req, res) => {
    const transactions = readTransactions();
    const idx = transactions.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.sendStatus(404);
    transactions[idx] = { ...transactions[idx], ...req.body };
    writeTransactions(transactions);
    res.json(transactions[idx]);
});

// DELETE transaction
app.delete("/transactions/:id", (req, res) => {
    let transactions = readTransactions();
    transactions = transactions.filter(t => t.id !== req.params.id);
    writeTransactions(transactions);
    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
