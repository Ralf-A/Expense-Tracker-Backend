const pool = require('../database');

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.params.userId; // Assuming userId is part of the request parameters

        // Example: Insert the category into the database with user_id
        const newCategory = await pool.query(
            "INSERT INTO categories(name, user_id) VALUES ($1, $2) RETURNING *",
            [name, userId]
        );

        res.status(201).json(newCategory.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const categoryId = req.params.categoryId;

        // Example: Update the category in the database
        const updatedCategory = await pool.query(
            "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
            [name, categoryId]
        );

        res.status(200).json(updatedCategory.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        // Example: Delete the category and associated expenses from the database
        const deletedCategory = await pool.query(
            "DELETE FROM categories WHERE id = $1 RETURNING *",
            [categoryId]
        );

        // Delete associated expenses
        await pool.query(
            "DELETE FROM expenses WHERE category_id = $1",
            [categoryId]
        );

        res.status(200).json(deletedCategory.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};


const deleteAllCategories = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Example: Retrieve all categories for the user from the database
        const categories = await pool.query(
            "SELECT id FROM categories WHERE user_id = $1",
            [userId]
        );

        // Delete associated expenses for each category
        for (const category of categories.rows) {
            await pool.query(
                "DELETE FROM expenses WHERE category_id = $1",
                [category.id]
            );
        }

        // Delete all categories for the user
        const deletedCategories = await pool.query(
            "DELETE FROM categories WHERE user_id = $1 RETURNING *",
            [userId]
        );

        res.status(200).json(deletedCategories.rows);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    deleteAllCategories,
};
