// routes/forgotPasswordRoutes.js
const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPasswordController');

router.post('/forgotPassword', forgotPasswordController.forgotPassword);
router.post('/resetPassword', forgotPasswordController.resetPassword);

module.exports = router;
