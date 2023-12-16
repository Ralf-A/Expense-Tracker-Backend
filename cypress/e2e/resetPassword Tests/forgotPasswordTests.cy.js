// cypress/integration/forgotPasswordTests.cy.js

describe('Forgot Password Tests', () => {
  const apiUrl = 'http://localhost:3000/auth/forgotPassword';
  let userId; // Declare the userId variable

  // Before the test suite, create a new user
  before(() => {
    const userData = {
      username: 'testUser',
      email: 'testuser@example.com',
      password: 'Password1',
    };

    cy.request('POST', 'http://localhost:3000/auth/signup', userData)
      .should((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('user_id');
        userId = response.body.user_id;
      });
  });

  // After the test suite, delete the created user
  after(() => {
    if (userId) {
      cy.request('DELETE', `http://localhost:3000/auth/deleteUser/${userId}`)
        .should((response) => {
          expect(response.status).to.eq(200);
        });
    }
  });

  it('should successfully send a reset token email', () => {
    const forgotPasswordData = {
      email: 'testuser@example.com', // Use the created user's email
    };

    cy.request('POST', apiUrl, forgotPasswordData)
      .should((response) => {
        expect(response.status).to.eq(200);
        // Add more assertions if needed
        expect(response.body.message).to.eq("Reset token email sent successfully");
      });
  });

  it('should handle invalid email', () => {
    const invalidEmailData = {
      email: 'invalidemail@example.com',
    };

    cy.request({
      method: 'POST',
      url: apiUrl,
      body: invalidEmailData,
      failOnStatusCode: false,
    })
      .should((response) => {
        expect(response.status).to.eq(404);
        // Add more assertions if needed
        expect(response.body.error).to.eq("User not found");
      });
  });

  it('should handle missing email', () => {
    const missingEmailData = {}; // No email provided

    cy.request({
      method: 'POST',
      url: apiUrl,
      body: missingEmailData,
      failOnStatusCode: false,
    })
      .should((response) => {
        expect(response.status).to.eq(400);
        // Add more assertions if needed
      });
  });

  // Add more test cases for edge cases, invalid inputs, etc.
});
