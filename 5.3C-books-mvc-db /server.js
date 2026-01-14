const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

// 1. Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/booksDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log(' Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error(' MongoDB connection error:', err);
});

// 2. App + middleware
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 3. Routes (MVC)
const booksRoute = require('./routes/books.routes');
app.use('/api/books', booksRoute);

// Integrity check route
app.get('/api/integrity-check42', (req, res) => {
    res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        statusCode: 500,
        data: null,
        message: 'Internal Server Error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
