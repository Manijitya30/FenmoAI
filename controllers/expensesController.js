const { v4: uuidv4 } = require("uuid");
const db = require("../db");
function formatExpense(expense) {
  return {
    ...expense,
    amount: expense.amount / 100, 
  };
}
function isValidDate(dateStr) {
  if (!dateStr) return false;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  if (!iso) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}
exports.createExpense = (req, res) => {
  try {
    const idempotencyKey = req.headers["idempotency-key"];
    if (!idempotencyKey || idempotencyKey.trim() === "") {
      return res.status(400).json({
        error: "Missing required header: Idempotency-Key",
      });
    }
    const existing = db
      .prepare("SELECT * FROM expenses WHERE idempotency_key = ?")
      .get(idempotencyKey);
    if (existing) {
      return res.status(200).json({
        message: "Duplicate request – returning existing expense",
        expense: formatExpense(existing),
      });
    }
    const { amount, category, description, date } = req.body;
    const errors = [];
    if (amount === undefined || amount === null) {
      errors.push("amount is required");
    } else if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      errors.push("amount must be a positive number");
    }
    if (!category || category.trim() === "") {
      errors.push("category is required");
    }
    if (!date) {
      errors.push("date is required");
    } else if (!isValidDate(date)) {
      errors.push("date must be a valid ISO date string (YYYY-MM-DD)");
    }
    if (errors.length > 0) {
      return res.status(422).json({ error: "Validation failed", details: errors });
    }
    const id = uuidv4();
    const amountInPaise = Math.round(amount * 100); 
    const createdAt = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO expenses (id, amount, category, description, date, created_at, idempotency_key)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      amountInPaise,
      category.trim(),
      description ? description.trim() : null,
      date,
      createdAt,
      idempotencyKey
    );
    const created = db.prepare("SELECT * FROM expenses WHERE id = ?").get(id);
    return res.status(201).json({
      message: "Expense created successfully",
      expense: formatExpense(created),
    });
  } catch (err) {
    console.error("[createExpense] Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.getExpenses = (req, res) => {
  try {
    const { category, sort } = req.query;
    let sql = "SELECT * FROM expenses";
    const params = [];
    if (category) {
      sql += " WHERE LOWER(category) = LOWER(?)";
      params.push(category);
    }
    if (sort === "date_desc") {
      sql += " ORDER BY date DESC";
    } else {
      sql += " ORDER BY created_at DESC";
    }
    const rows = db.prepare(sql).all(...params);
    return res.status(200).json({
      count: rows.length,
      expenses: rows.map(formatExpense),
    });
  } catch (err) {
    console.error("[getExpenses] Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
