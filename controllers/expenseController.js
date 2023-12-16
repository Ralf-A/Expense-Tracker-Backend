const pool = require('../database');

const createExpense = async (req, res) => {
    try {
        // Extract data from the request body
        const { amount, description, date, category, user_id, category_id } = req.body;

        // TODO: Perform any necessary validation on the input data

        // Example: Insert the expense into the database
        const newExpense = await pool.query(
            "INSERT INTO expenses(amount, description, date, category, user_id, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [amount, description, date, category, user_id, category_id]
        );

        // TODO: You may want to do additional processing or error checking

        res.status(201).json(newExpense.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

const updateExpense = async (req, res) => {
    try {
        const { amount, description, date, category, user_id, category_id } = req.body;
        const expenseId = req.params.expenseId; // Correct parameter name

        // TODO: Perform any necessary validation on the input data

        // Example: Update the expense in the database
        const updatedExpense = await pool.query(
            "UPDATE expenses SET amount = $1, description = $2, date = $3, category = $4, user_id = $5, category_id = $6 WHERE id = $7 RETURNING *",
            [amount, description, date, category, user_id, category_id, expenseId] // Correct parameter order
        );

        // TODO: You may want to do additional processing or error checking

        res.status(200).json(updatedExpense.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.expenseId;

        // Example: Delete the expense from the database
        const deletedExpense = await pool.query(
            "DELETE FROM expenses WHERE id = $1 RETURNING *",
            [expenseId]
        );

        // TODO: You may want to do additional processing or error checking

        res.status(200).json(deletedExpense.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

const deleteAllExpenses = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Example: Delete all expenses for the user from the database
        const deletedExpenses = await pool.query(
            "DELETE FROM expenses WHERE user_id = $1 RETURNING *",
            [userId]
        );

        // TODO: You may want to do additional processing or error checking

        res.status(200).json(deletedExpenses.rows);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

const getExpenses = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Example: Retrieve all expenses for the user from the database
        const userExpenses = await pool.query(
            "SELECT * FROM expenses WHERE user_id = $1",
            [userId]
        );

        res.status(200).json(userExpenses.rows);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

const getExpense = async (req, res) => {
    try {
        const expenseId = req.params.expenseId;

        // Example: Retrieve a single expense by expense ID from the database
        const expense = await pool.query(
            "SELECT * FROM expenses WHERE id = $1",
            [expenseId]
        );

        // Check if the expense exists
        if (expense.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.status(200).json(expense.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createExpense,
    updateExpense,
    deleteExpense,
    deleteAllExpenses,
    getExpenses,
    getExpense,
};
