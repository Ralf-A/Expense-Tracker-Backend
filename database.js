const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "sql", //add your password
    database: "Expense-tracker",
    host: "localhost",
    port: "5432"
});

const execute = async (query) => {
    try {
        const result = await pool.query(query);
        return result;
    } catch (error) {
        console.error(error.stack);
        return null; // Return null or handle the error accordingly
    }
};


const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS "users" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    );
`;
execute(createUsersTableQuery).then(result => {
    if (result) {
        console.log('Table "users" is created!');
    }
});

const createCategoriesTableQuery = `
    CREATE TABLE IF NOT EXISTS "categories" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        user_id UUID,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`;

execute(createCategoriesTableQuery).then(result => {
    if (result) {
        console.log('Table "categories" is created');
    }
});

const createExpensesTableQuery = `
    CREATE TABLE IF NOT EXISTS expenses (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        category TEXT,
        user_id UUID,
        category_id UUID, 
        FOREIGN KEY (category_id) REFERENCES categories(id)
    );
`;
execute(createExpensesTableQuery).then(result => {
    if (result) {
        console.log('Table "expenses" is created');
    }
});

module.exports = pool;