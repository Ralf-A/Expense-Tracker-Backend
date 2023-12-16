// cypress/integration/deleteUserTests.cy.js

describe('Delete User API Test', () => {
    // Assuming your server is running on localhost:3000
    const apiUrl = 'http://localhost:3000/auth/deleteUser';
  
    let userId; // Store the user ID obtained during user creation
  
    before(() => {
      // Create a user to be deleted
      const newUser = {
        username: 'user',
        email: 'del@example.com',
        password: 'testPassword1',
      };
  
      // Create the user and store the user ID
      cy.request('POST', 'http://localhost:3000/auth/signup', newUser)
        .its('body.user_id')
        .then((id) => {
          userId = id;
        });
    });
  
    it('should delete a user', () => {
      // Delete the user created in the before block
      cy.request('DELETE', `${apiUrl}/${userId}`)
        .should((response) => {
          expect(response.status).to.eq(200);
          // Add more assertions for successful user deletion
          expect(response.body).to.have.property('message', 'User and associated data deleted successfully');
        });
    });
  
    it('should handle deletion of non-existent user', () => {
      // Attempt to delete a non-existent user
      const nonExistentUserId = 'nonexistentuserid';
  
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/${nonExistentUserId}`,
        failOnStatusCode: false, // Allow non-2xx responses
      })
        .should((response) => {
          // Expect a 500 Internal Server Error status for non-existent user deletion
          expect(response.status).to.eq(500);
          // Add more assertions if needed
        });
    });
  
    // Add more test cases for edge cases, invalid inputs, etc.
  });
  