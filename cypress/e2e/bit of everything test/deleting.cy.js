// cypress/integration/deleteTestData.spec.js

describe('Delete Test Data', () => {
  let createdUserId;
  let createdCategoryId;
  let createdExpenseId;

  before(() => {
    // Create test data
    cy.request('POST', 'http://localhost:3000/auth/signup', {
      id: '123',
      username: 'tetuer',
      email: 'tester@example.com',
      password: 'Password1',
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('user_id');
      createdUserId = response.body.user_id;

      cy.request('POST', `http://localhost:3000/api/createCategory/${createdUserId}`, {
        id: '123',
        name: 'TestCategory',
        user_id: createdUserId,
      }).then((categoryResponse) => {
        expect(categoryResponse.status).to.eq(201);
        expect(categoryResponse.body).to.have.property('id');
        expect(categoryResponse.body.name).to.eq('TestCategory');
        createdCategoryId = categoryResponse.body.id;

        cy.request('POST', `http://localhost:3000/api/createExpense/${createdUserId}`, {
          id: '123',
          amount: 50.00,
          description: 'TestExpense',
          date: '2023-12-16',
          category_id: createdCategoryId,
          user_id: createdUserId,
        }).then((expenseResponse) => {
          expect(expenseResponse.status).to.eq(201);
          expect(expenseResponse.body).to.have.property('id');
          expect(parseFloat(expenseResponse.body.amount)).to.eq(50.00);
          expect(expenseResponse.body.description).to.eq('TestExpense');
          expect(expenseResponse.body.category_id).to.eq(createdCategoryId);
          expect(expenseResponse.body.user_id).to.eq(createdUserId);
          createdExpenseId = expenseResponse.body.id;
        });
      });
    });
  });

  it('should delete test data', () => {
    // Delete expense
    cy.request('DELETE', `http://localhost:3000/api/deleteExpense/${createdExpenseId}`)
      .should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id');
        expect(response.body.id).to.eq(createdExpenseId);
      });

    // Delete category
    cy.request('DELETE', `http://localhost:3000/api/deleteCategory/${createdCategoryId}`)
      .should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id');
        expect(response.body.id).to.eq(createdCategoryId);
      });

    // Delete user
    cy.request('DELETE', `http://localhost:3000/auth/deleteUser/${createdUserId}`)
      .should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('User and associated data deleted successfully');
      });
  });
});
