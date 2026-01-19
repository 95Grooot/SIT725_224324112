const express = require('express');
const router = express.Router();

// Import all controllers via index.js
const Controllers = require('../controllers');

// GET /api/books - Get all books
router.get('/', Controllers.booksController.getAllBooks);

// GET /api/books/:id - Get book by ID
router.get('/:id', Controllers.booksController.getBookById);

// POST /api/books - Create a new book (safe write)
// Returns: 201 Created, 409 Conflict, 400 Bad Request
router.post('/', Controllers.booksController.createBook);

// PUT /api/books/:id - Update an existing book (safe write)
// Returns: 200 OK, 404 Not Found, 400 Bad Request
router.put('/:id', Controllers.booksController.updateBook);

module.exports = router;
