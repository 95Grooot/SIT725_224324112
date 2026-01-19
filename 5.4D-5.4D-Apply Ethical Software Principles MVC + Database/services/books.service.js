const Book = require('../models/bookModel');

// Get all books from database
async function getAllBooks() {
    const books = await Book.find({});
    return books.map(book => book.toJSON());
}

// Get book by ID from database
async function getBookById(id) {
    const book = await Book.findOne({ id: id });
    return book ? book.toJSON() : null;
}

// Create a new book (safe write with validation)
async function createBook(bookData) {
    // Validate allowed fields - throws if extra fields present
    Book.validateAllowedFields(bookData, false);
    
    // Sanitize input to only include allowed fields
    const sanitizedData = Book.sanitizeInput(bookData);
    
    // Check for duplicate ID
    const existingBook = await Book.findOne({ id: sanitizedData.id });
    if (existingBook) {
        const error = new Error(`Book with ID '${sanitizedData.id}' already exists`);
        error.name = 'DuplicateKeyError';
        throw error;
    }
    
    // Create and save the book (Mongoose validation will run)
    const book = new Book(sanitizedData);
    await book.save();
    
    return book.toJSON();
}

// Update an existing book (safe write with validation)
async function updateBook(id, updateData) {
    // Validate allowed fields - throws if extra fields or id change attempted
    Book.validateAllowedFields(updateData, true);
    
    // Sanitize input to only include allowed fields
    const sanitizedData = Book.sanitizeInput(updateData);
    
    // Check if book exists
    const existingBook = await Book.findOne({ id: id });
    if (!existingBook) {
        const error = new Error(`Book with ID '${id}' not found`);
        error.name = 'NotFoundError';
        throw error;
    }
    
    // Update fields
    Object.keys(sanitizedData).forEach(key => {
        existingBook[key] = sanitizedData[key];
    });
    
    // Save with validation
    await existingBook.save();
    
    return existingBook.toJSON();
}

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook
};
