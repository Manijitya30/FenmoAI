const express = require("express");
const router = express.Router();
const expensesController = require("../controllers/expensesController");
router.post("/", expensesController.createExpense);
router.get("/", expensesController.getExpenses);
module.exports = router;
