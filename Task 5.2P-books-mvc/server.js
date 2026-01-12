const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Create Express app
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes (MVC)
const booksRoute = require('./routes/books.routes');
app.use('/api/books', booksRoute);

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
