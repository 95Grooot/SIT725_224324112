const express = require('express');
const router = express.Router();

// Import all controllers via index.js
const Controllers = require('../controllers');

// GET /api/books - Get all books
router.get('/', Controllers.booksController.getAllBooks);

// GET /api/books/:id - Get book by ID
router.get('/:id', Controllers.booksController.getBookById);

module.exports = router;
