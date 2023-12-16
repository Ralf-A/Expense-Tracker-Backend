// cypress/integration/expense.spec.js
describe('Expense Tests', () => {
    const apiUrl = 'http://localhost:3000';
    let userId;
    let categoryId;
    let createdExpenseId;

    before(() => {
        // Create a new user
        cy.request('POST', `${apiUrl}/auth/signup`, {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'Password1',
        }).then((response) => {
            expect(response.status).to.eq(201);
            userId = response.body.user_id;

            // Create a new category
            cy.request('POST', `${apiUrl}/api/createCategory/${userId}`, {
                name: 'TestCategory',
                user_id: userId,
            }).then((categoryResponse) => {
                expect(categoryResponse.status).to.eq(201);
                categoryId = categoryResponse.body.id;
            });
        });
    });
    it('should create a new expense for a user', () => {
        // Create a new expense data
        const expenseData = {
            amount: 50.00,
            description: 'Test Expense',
            date: '2023-01-01',
            category_id: categoryId,
            user_id: userId,
        };

        // Make a request to create a new expense
        cy.request('POST', `${apiUrl}/api/createExpense/${userId}`, expenseData)
            .should((response) => {
                expect(response.status).to.eq(201);
                expect(response.body).to.have.property('id');

                // Convert the 'amount' property to a number for assertions
                const amountValue = parseFloat(response.body.amount);

                expect(amountValue).to.be.a('number');
                expect(amountValue).to.be.closeTo(50, 0.01); // Adjust the delta value as needed
                createdExpenseId = response.body.id;
            });
    });

    it('should update an existing expense', () => {
        // Updated expense data
        const updatedExpenseData = {
            amount: 75.00,
            description: 'Updated Test Expense',
            date: '2023-01-02',
            category_id: categoryId,
            user_id: userId,
        };

        // Make a request to update an existing expense
        cy.request('PUT', `${apiUrl}/api/updateExpense/${createdExpenseId}`, updatedExpenseData)
            .should((response) => {
                expect(response.status).to.eq(200);
                
                // Convert the 'amount' property to a number for assertions
                const updatedAmountValue = parseFloat(response.body.amount);

                expect(updatedAmountValue).to.be.a('number');
                expect(updatedAmountValue).to.eq(75.00);
            });
    });

    it('should retrieve all expenses for a user', () => {
        // Make a request to retrieve all expenses for a user
        cy.request('GET', `${apiUrl}/api/getExpenses/${userId}`)
            .should((response) => {
                expect(response.status).to.eq(200);
                // Ensure the response is an array of expenses
                expect(response.body).to.be.an('array');
            });
    });

    it('should retrieve a single expense by ID', () => {
        // Make a request to retrieve a single expense by ID
        cy.request('GET', `${apiUrl}/api/getExpense/${createdExpenseId}`)
            .should((response) => {
                expect(response.status).to.eq(200);
                // Ensure the response is a single expense object
                expect(response.body).to.have.property('id');
            });
    });

    after(() => {
        // Delete everything created during the test
        cy.request('DELETE', `${apiUrl}/api/deleteExpense/${createdExpenseId}`);
        cy.request('DELETE', `${apiUrl}/api/deleteCategory/${categoryId}`);
        cy.request('DELETE', `${apiUrl}/auth/deleteUser/${userId}`);
    });
});
