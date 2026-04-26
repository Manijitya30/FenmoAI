require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
require("./db");
const expensesRouter = require("./routes/expenses");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/expenses", expensesRouter);
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/expenses", (_req, res) => {
  res.status(404).json({ error: "Route not found" });
});
app.use((err, _req, res, _next) => {
  console.error("[Unhandled Error]", err);
  res.status(500).json({ error: "An unexpected error occurred" });
});
app.listen(PORT, () => {
  console.log(`✅ Expense Tracker running on http://localhost:${PORT}`);
  console.log(`   Frontend    → http://localhost:${PORT}`);
  console.log(`   Health      → http://localhost:${PORT}/health`);
  console.log(`   Expenses API→ http://localhost:${PORT}/expenses`);
});
