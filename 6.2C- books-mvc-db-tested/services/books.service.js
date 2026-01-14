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

module.exports = {
    getAllBooks,
    getBookById
};
