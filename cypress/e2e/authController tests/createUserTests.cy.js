// cypress/integration/createUserTests.cy.js

describe('Create User API Tests', () => {
  // Assuming your server is running on localhost:3000
  const apiUrl = 'http://localhost:3000/auth/signup';
  let userId; // Store the user ID obtained during user creation

  after(() => {
    // Delete the created user after all tests are executed
    if (userId) {
      cy.request('DELETE', `http://localhost:3000/auth/deleteUser/${userId}`)
        .its('status')
        .should('eq', 200);
    }
  });

  it('should create a new user', () => {
    const newUser = {
      username: 'admin',
      email: 'ralfanimagi@gmail.com',
      password: 'testPassword1',
    };

    cy.request('POST', apiUrl, newUser)
      .should((response) => {
        expect(response.status).to.eq(201);
        // Store the user ID for deletion in the after block
        userId = response.body.user_id;
        expect(userId).to.be.a('string');
        // Add more assertions for a successful user creation
      });
  });

  it('should handle duplicate username', () => {
    // Create a user with a duplicate username
    const duplicateUsernameUser = {
      username: 'testUser', // Use the same username as the first test
      email: 'anotheruser@example.com',
      password: 'anotherPassword',
    };

    cy.request({
      method: 'POST',
      url: apiUrl,
      body: duplicateUsernameUser,
      failOnStatusCode: false, // Allow non-2xx responses
    })
      .should((response) => {
        // Expect a 400 Bad Request status for duplicate username
        expect(response.status).to.eq(400);
        // Add more assertions if needed
      });
  });

  it('should handle duplicate email', () => {
    // Create a user with a duplicate email
    const duplicateEmailUser = {
      username: 'anotherTestUser',
      email: 'testuser@example.com', // Use the same email as the first test
      password: 'anotherPassword',
    };

    cy.request({
      method: 'POST',
      url: apiUrl,
      body: duplicateEmailUser,
      failOnStatusCode: false, // Allow non-2xx responses
    })
      .should((response) => {
        // Expect a 400 Bad Request status for duplicate email
        expect(response.status).to.eq(400);
        // Add more assertions if needed
      });
  });
  
});
