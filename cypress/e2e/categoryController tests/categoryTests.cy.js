// cypress/integration/categories.spec.js
describe('Category Tests', () => {
  let createdCategoryId;
  let createdUserId; // Store the created user ID

  before(() => {
    // Create a new user before running the category tests
    const newUser = {
      username: 'testUser',
      email: 'testuser@example.com',
      password: 'Password1',
    };

    cy.request('POST', 'http://localhost:3000/auth/signup', newUser)
      .should((response) => {
        expect(response.status).to.eq(201);
        createdUserId = response.body.user_id;
        expect(createdUserId).to.be.a('string');
      });
  });

  after(() => {
    // Delete the created user after all tests are executed
    if (createdUserId) {
      cy.request('DELETE', `http://localhost:3000/auth/deleteUser/${createdUserId}`)
        .its('status')
        .should('eq', 200);
    }
  });

  it('should create a new category for a user', () => {
    // Create a new category data
    const categoryData = {
      name: 'TestCategory',
    };

    // Make a request to create a new category for the created user
    cy.request('POST', `http://localhost:3000/api/createCategory/${createdUserId}`, categoryData)
      .should((response) => {
        expect(response.status).to.eq(201);
        // Ensure the response contains the created category
        expect(response.body).to.have.property('id');
        expect(response.body.name).to.eq('TestCategory');
        createdCategoryId = response.body.id; // Store the created category ID for future tests
      });
  });

  it('should update the created category', () => {
    const updatedCategoryData = {
      name: 'Updated Category',
    };

    cy.request('PUT', `http://localhost:3000/api/updateCategory/${createdCategoryId}`, updatedCategoryData)
      .should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq('Updated Category');
      });
  });
  it('should get categories for a user', () => {
    cy.request('GET', `http://localhost:3000/api/getCategories/${createdUserId}`)
      .should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  it('should delete the created category', () => {
    cy.request('DELETE', `http://localhost:3000/api/deleteCategory/${createdCategoryId}`)
      .should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(createdCategoryId);
      });
  });



  it('should delete all categories for a user', () => {
    cy.request('DELETE', `http://localhost:3000/api/deleteAllCategories/${createdUserId}`)
      .should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  // Add more test cases for edge cases, invalid inputs, etc.
});
