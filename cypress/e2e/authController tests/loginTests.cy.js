// cypress/integration/loginTests.cy.js

describe('Login Tests', () => {
  // Assuming your server is running on localhost:3000
  const apiUrl = 'http://localhost:3000/auth/login';
  let userId; // Store the user ID obtained during successful login

  before(() => {
    // Create a new user before running the tests
    const createUser = {
      username: 'testUser',
      email: 'testuser@example.com',
      password: 'Password1',
    };

    cy.request('POST', 'http://localhost:3000/auth/signup', createUser)
    .should((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('user_id');
      userId = response.body.user_id; // Update the property name to 'user_id'
    });
});

after(() => {
  // Delete any data created during the test (if needed)
  // For example, if you created a user during a successful login test, you might want to delete that user.
  if (userId) {
    cy.request('DELETE', `http://localhost:3000/auth/deleteUser/${userId}`)
      .its('status')
      .should('eq', 200);
  }
});

it('should successfully login with correct credentials', () => {
  const loginUser = {
    username: 'testUser',
    password: 'Password1',
  };

  cy.request('POST', apiUrl, loginUser)
    .should((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('user_id');
    });
});

  it('should handle unsuccessful login with incorrect password', () => {
    const incorrectPasswordUser = {
      username: 'testUser',
      password: 'Password2',
    };

    cy.request({
      method: 'POST',
      url: apiUrl,
      body: incorrectPasswordUser,
      failOnStatusCode: false,
    })
      .should((response) => {
        expect(response.status).to.eq(401);
        // Add more assertions if needed
      });
  });

  it('should handle unsuccessful login with a non-existent username', () => {
    const nonExistentUser = {
      username: 'nonExistentUser',
      password: 'somePassword',
    };

    cy.request({
      method: 'POST',
      url: apiUrl,
      body: nonExistentUser,
      failOnStatusCode: false,
    })
      .should((response) => {
        expect(response.status).to.eq(401);
        // Add more assertions if needed
      });
  });

  it('should handle unsuccessful login with missing username', () => {
    const missingUsernameUser = {
      password: 'somePassword',
    };

    cy.request({
      method: 'POST',
      url: apiUrl,
      body: missingUsernameUser,
      failOnStatusCode: false,
    })
      .should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error', 'Username and password are required');
      });
  });

  it('should handle unsuccessful login with missing password', () => {
    const missingPasswordUser = {
      username: 'testUser',
    };

    cy.request({
      method: 'POST',
      url: apiUrl,
      body: missingPasswordUser,
      failOnStatusCode: false,
    })
      .should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error', 'Username and password are required');
      });
  });
});
