const test = require('node:test');
const assert = require('node:assert');
const { v4: uuidv4 } = require('uuid');
const expensesController = require('../controllers/expensesController');
function createMocks(body, query, headers) {
  const req = { body, query: query || {}, headers: headers || {} };
  const res = {
    statusCode: null,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    }
  };
  return { req, res };
}
test('Expense Controller Tests', async (t) => {
  await t.test('POST /expenses - Validates missing Idempotency-Key', (t) => {
    const { req, res } = createMocks({}, {}, {});
    expensesController.createExpense(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.match(res.jsonData.error, /Missing required header: Idempotency-Key/);
  });
  await t.test('POST /expenses - Creates new expense correctly', (t) => {
    const idempotencyKey = uuidv4();
    const payload = {
      amount: 450.50,
      category: 'Food',
      description: 'Dinner',
      date: '2026-04-26'
    };
    const { req, res } = createMocks(payload, {}, { 'idempotency-key': idempotencyKey });
    expensesController.createExpense(req, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.jsonData.message, 'Expense created successfully');
    assert.strictEqual(res.jsonData.expense.amount, 450.50);
    assert.strictEqual(res.jsonData.expense.category, 'Food');
    assert.strictEqual(res.jsonData.expense.idempotency_key, idempotencyKey);
  });
  await t.test('POST /expenses - Idempotency duplicate returns 200 and existing expense', (t) => {
    const idempotencyKey = uuidv4();
    const payload = {
      amount: 100,
      category: 'Travel',
      date: '2026-04-26'
    };
    const { req: req1, res: res1 } = createMocks(payload, {}, { 'idempotency-key': idempotencyKey });
    expensesController.createExpense(req1, res1);
    assert.strictEqual(res1.statusCode, 201);
    const { req: req2, res: res2 } = createMocks(payload, {}, { 'idempotency-key': idempotencyKey });
    expensesController.createExpense(req2, res2);
    assert.strictEqual(res2.statusCode, 200);
    assert.strictEqual(res2.jsonData.message, 'Duplicate request – returning existing expense');
    assert.strictEqual(res2.jsonData.expense.id, res1.jsonData.expense.id);
  });
  await t.test('POST /expenses - Validates negative amount', (t) => {
    const idempotencyKey = uuidv4();
    const payload = {
      amount: -50,
      category: 'Food',
      date: '2026-04-26'
    };
    const { req, res } = createMocks(payload, {}, { 'idempotency-key': idempotencyKey });
    expensesController.createExpense(req, res);
    assert.strictEqual(res.statusCode, 422);
    assert.ok(res.jsonData.details.includes('amount must be a positive number'));
  });
});
