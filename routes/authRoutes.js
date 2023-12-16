// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/authenticate', authController.authenticateUser);
router.post('/signup', authController.signupUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);
router.delete('/deleteUser/:userId', authController.deleteUser); 

module.exports = router;
