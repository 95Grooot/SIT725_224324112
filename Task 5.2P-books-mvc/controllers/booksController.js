// Import the service
const booksService = require('../services/books.service');

// Controller uses the service to get all books
exports.getAllBooks = (req, res, next) => {
    try {
        const books = booksService.getAllBooks();
        res.status(200).json({
            statusCode: 200,
            data: books,
            message: 'Books retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};

// Controller uses the service to get a book by ID
exports.getBookById = (req, res, next) => {
    try {
        const { id } = req.params;
        const book = booksService.getBookById(id);
        
        if (!book) {
            return res.status(404).json({
                statusCode: 404,
                data: null,
                message: 'Book not found'
            });
        }
        
        res.status(200).json({
            statusCode: 200,
            data: book,
            message: 'Book retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};
