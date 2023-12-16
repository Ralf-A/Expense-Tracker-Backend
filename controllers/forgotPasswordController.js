const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateJWT = require('./authController');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-default-secret-key'; // Use environment variable

const generateResetToken = (userId) => {
  const resetToken = jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: '1h' });
  return resetToken;
};

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: '',
  port: '',
  auth: {
    user: '',
    pass: '',
  },
});

module.exports = transporter;


/*const sendResetTokenEmail = (email, resetToken) => {
  const resetLink = `http://your-frontend-app/reset-password?token=${resetToken}`;
*/
// Instead of sending an email, log the reset token
const sendResetTokenEmail = (email, resetToken) => {
  console.log(`Reset token for ${email}: ${resetToken}`);
};

module.exports = sendResetTokenEmail;

// The rest of your code remains unchanged...

/*  const mailOptions = {
    from: 'ralfanimagi@gmail.com',
    to: email,
    subject: 'Password Reset Link',
    text: `Click on the following link to reset your password: ${resetLink}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error.message);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
*/

module.exports = sendResetTokenEmail;

const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Validate if the email is provided
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      // Check if the email exists in the database
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
      if (user.rows.length === 0) {
        // If the email is not found, respond with a 404 status
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Generate and save the reset token to the database
      const resetToken = generateResetToken(user.rows[0].id);
      // In a real application, you might save the token in the database associated with the user.
  
      // Send the reset email
      sendResetTokenEmail(email, resetToken);
  
      res.status(200).json({ message: 'Reset token email sent successfully' });
    } catch (error) {
      console.error(error);
      // If there's an error, respond with a 500 Internal Server Error status
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  const resetPassword = async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
  
      // Verify the reset token
      let decodedToken;
      try {
        decodedToken = jwt.verify(resetToken, JWT_SECRET_KEY);
      } catch (error) {
        console.error('Error verifying reset token:', error);
        return res.status(401).json({ error: 'Invalid or expired reset token' });
      }
  
      // Check password complexity
      if (!isPasswordStrong(newPassword)) {
        console.error('Invalid password complexity');
        return res.status(400).json({ error: 'Password does not meet complexity requirements' });
      }
  
      // Update the user's password in the database
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, decodedToken.userId]);
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Internal server error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const isPasswordStrong = (password) => {
    if (password.length < 8) {
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    if (!/\d/.test(password)) {
        return false;
    }
    return true;
};
  
module.exports = {
    forgotPassword,
    resetPassword,
  };
