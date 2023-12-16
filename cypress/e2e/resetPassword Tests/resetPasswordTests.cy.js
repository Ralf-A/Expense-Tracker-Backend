// cypress/integration/resetPassword.spec.js
const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-default-secret-key'; // Use environment variable

const generateResetToken = (userId) => {
    const resetToken = jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: '1h' });
    return resetToken;
};

describe('Reset Password Tests', () => {
    const apiUrl = 'http://localhost:3000/auth/resetPassword';
    let resetToken; // Declare resetToken variable to store the dynamically generated token
    let userId; // Declare userId variable to store the user ID

    // Before each test, create a new user and generate a reset token
    beforeEach(() => {
        // Delete the user if it already exists
        if (userId) {
            cy.request('DELETE', `http://localhost:3000/auth/deleteUser/${userId}`)
                .its('status')
                .should('eq', 200);
        }

        // Create a new user
        cy.request('POST', 'http://localhost:3000/auth/signup', {
            username: 'testUser',
            email: 'testuser@example.com',
            password: 'Password1',
        }).then((response) => {
            expect(response.status).to.eq(201);
            userId = response.body.user_id;

            // Generate a reset token for the created user
            resetToken = generateResetToken(userId);
        });
    });

    it('should successfully reset password with valid token and new password', () => {
        const resetPasswordData = {
            resetToken,
            newPassword: 'newPassword123',
        };

        cy.request('POST', apiUrl, resetPasswordData)
            .should((response) => {
                expect(response.status).to.eq(200);
                // Add more assertions if needed
            });
    });

    it('should handle invalid or expired reset token', () => {
        const resetPasswordData = {
            resetToken: 'invalid-or-expired-token',
            newPassword: 'newPassword123',
        };

        cy.request({
            method: 'POST',
            url: apiUrl,
            failOnStatusCode: false,
            body: resetPasswordData,
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.error).to.eq('Invalid or expired reset token');
        });
    });

    it('should handle invalid password complexity', () => {
        const resetPasswordData = {
            resetToken,
            newPassword: 'weakpassword',
        };

        cy.request({
            method: 'POST',
            url: apiUrl,
            failOnStatusCode: false,
            body: resetPasswordData,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.error).to.eq('Password does not meet complexity requirements');
        });
    });

    // After all tests, delete the user
    after(() => {
        if (userId) {
            cy.request('DELETE', `http://localhost:3000/auth/deleteUser/${userId}`)
                .its('status')
                .should('eq', 200);
        }
    });
});
