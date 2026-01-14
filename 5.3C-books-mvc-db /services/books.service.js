const Book = require('../models/bookModel');

// Get all books from database
async function getAllBooks() {
    return Book.find({}).lean({ getters: true });
}

// Get book by ID from database
async function getBookById(id) {
    return Book.findOne({ id: id }).lean({ getters: true });
}

module.exports = {
    getAllBooks,
    getBookById
};
