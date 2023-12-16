// routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/createExpense/:userId', expenseController.createExpense);
router.put('/updateExpense/:expenseId', expenseController.updateExpense);
router.delete('/deleteExpense/:expenseId', expenseController.deleteExpense);
router.delete('/deleteAllExpenses/:userId', expenseController.deleteAllExpenses);
router.get('/getExpenses/:userId', expenseController.getExpenses);
router.get('/getExpense/:expenseId', expenseController.getExpense);

module.exports = router;
