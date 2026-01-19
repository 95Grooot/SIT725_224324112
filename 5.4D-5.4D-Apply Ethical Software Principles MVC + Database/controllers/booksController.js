// Import the service
const booksService = require('../services/books.service');

// Student ID marker for integrity check
const DEVELOPED_BY = 'Shenal Naveen Fernando';

// Controller uses the service to get all books
exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await booksService.getAllBooks();
        res.status(200).json({
            statusCode: 200,
            data: books,
            message: 'Books retrieved successfully',
            developedBy: DEVELOPED_BY
        });
    } catch (err) {
        next(err);
    }
};

// Controller uses the service to get a book by ID
exports.getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await booksService.getBookById(id);
        
        if (!book) {
            return res.status(404).json({
                statusCode: 404,
                data: null,
                message: 'Book not found',
                developedBy: DEVELOPED_BY
            });
        }
        
        res.status(200).json({
            statusCode: 200,
            data: book,
            message: 'Book retrieved successfully',
            developedBy: DEVELOPED_BY
        });
    } catch (err) {
        next(err);
    }
};

// Controller to create a new book (POST /api/books)
// Returns: 201 Created, 409 Conflict (duplicate), 400 Bad Request (validation)
exports.createBook = async (req, res, next) => {
    try {
        const bookData = req.body;
        const newBook = await booksService.createBook(bookData);
        
        res.status(201).json({
            statusCode: 201,
            data: newBook,
            message: 'Book created successfully',
            developedBy: DEVELOPED_BY
        });
    } catch (err) {
        // Handle specific error types with appropriate HTTP status codes
        if (err.name === 'DuplicateKeyError') {
            return res.status(409).json({
                statusCode: 409,
                data: null,
                message: err.message,
                developedBy: DEVELOPED_BY
            });
        }
        
        if (err.name === 'ExtraFieldsError') {
            return res.status(400).json({
                statusCode: 400,
                data: null,
                message: err.message,
                developedBy: DEVELOPED_BY
            });
        }
        
        if (err.name === 'ValidationError') {
            // Mongoose validation error - extract messages
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                statusCode: 400,
                data: null,
                message: 'Validation failed: ' + messages.join('; '),
                errors: messages,
                developedBy: DEVELOPED_BY
            });
        }
        
        // MongoDB duplicate key error (fallback)
        if (err.code === 11000) {
            return res.status(409).json({
                statusCode: 409,
                data: null,
                message: 'Duplicate key error: Book ID already exists',
                developedBy: DEVELOPED_BY
            });
        }
        
        next(err);
    }
};

// Controller to update an existing book (PUT /api/books/:id)
// Returns: 200 OK, 404 Not Found, 400 Bad Request (validation)
exports.updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedBook = await booksService.updateBook(id, updateData);
        
        res.status(200).json({
            statusCode: 200,
            data: updatedBook,
            message: 'Book updated successfully',
            developedBy: DEVELOPED_BY
        });
    } catch (err) {
        // Handle specific error types
        if (err.name === 'NotFoundError') {
            return res.status(404).json({
                statusCode: 404,
                data: null,
                message: err.message,
                developedBy: DEVELOPED_BY
            });
        }
        
        if (err.name === 'ExtraFieldsError' || err.name === 'ImmutableFieldError') {
            return res.status(400).json({
                statusCode: 400,
                data: null,
                message: err.message,
                developedBy: DEVELOPED_BY
            });
        }
        
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                statusCode: 400,
                data: null,
                message: 'Validation failed: ' + messages.join('; '),
                errors: messages,
                developedBy: DEVELOPED_BY
            });
        }
        
        next(err);
    }
};
