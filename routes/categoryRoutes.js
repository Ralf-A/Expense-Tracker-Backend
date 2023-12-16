// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/createCategory/:userId', categoryController.createCategory);
router.put('/updateCategory/:categoryId', categoryController.updateCategory);
router.get('/getCategories/:userId', categoryController.getCategories); // Change POST to GET
router.delete('/deleteCategory/:categoryId', categoryController.deleteCategory);
router.delete('/deleteAllCategories/:userId', categoryController.deleteAllCategories);

module.exports = router;
