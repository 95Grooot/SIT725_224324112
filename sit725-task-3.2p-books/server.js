// server.js
var express = require("express");
var app = express();
var port = process.env.PORT || 3001;

// Serve static files from public directory
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// GET endpoint for books data
app.get('/api/books', (req, res) => {
    const books = [
        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            year: 1925,
            genre: "Classic Fiction",
            image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
            description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream."
        },
        {
            id: 2,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            year: 1960,
            genre: "Classic Fiction",
            image: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
            description: "A powerful story of racial injustice and childhood innocence in the American South."
        },
        {
            id: 3,
            title: "1984",
            author: "George Orwell",
            year: 1949,
            genre: "Dystopian Fiction",
            image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
            description: "A dystopian novel depicting a totalitarian society under constant surveillance."
        }
    ];
    
    res.json({
        statusCode: 200,
        data: books,
        message: "Books retrieved successfully"
    });
});

app.listen(port, () => {
    console.log("Server listening on port: " + port);
});