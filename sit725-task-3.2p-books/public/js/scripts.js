// scripts.js

// Books data will be fetched from server
let booksData = [];

// Initialize Materialize components
const initializeMaterialize = () => {
    $('.materialboxed').materialbox();
    $('.modal').modal();
};

// Load books from server
const loadBooks = () => {
    $.ajax({
        url: '/api/books',
        method: 'GET',
        success: function(response) {
            if (response.statusCode === 200) {
                booksData = response.data;
                displayBooks(booksData);
                M.toast({html: 'Books loaded successfully!', classes: 'green'});
            }
        },
        error: function(error) {
            console.error('Error loading books:', error);
            M.toast({html: 'Error loading books', classes: 'red'});
        }
    });
};

// Display books as cards
const displayBooks = (books) => {
    const booksSection = $('#books-section');
    booksSection.empty();
    
    if (books.length === 0) {
        booksSection.append(
            '<div class="col s12 center-align">' +
            '<p class="flow-text">No books available. Click "Load Books" to fetch the collection.</p>' +
            '</div>'
        );
        return;
    }
    
    books.forEach(book => {
        const bookCard = `
            <div class="col s12 m6 l4 book-card">
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="activator" src="${book.image}" alt="${book.title}">
                    </div>
                    <div class="card-content">
                        <span class="card-title activator grey-text text-darken-4">
                            ${book.title}
                            <i class="material-icons right">more_vert</i>
                        </span>
                        <p class="book-author">by ${book.author}</p>
                        <p class="book-year">${book.year}</p>
                        <span class="book-genre">${book.genre}</span>
                    </div>
                    <div class="card-action">
                        <a href="#" onclick="viewBookDetails(${book.id})">View Details</a>
                    </div>
                    <div class="card-reveal">
                        <span class="card-title grey-text text-darken-4">
                            ${book.title}
                            <i class="material-icons right">close</i>
                        </span>
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Year:</strong> ${book.year}</p>
                        <p><strong>Genre:</strong> ${book.genre}</p>
                        <p class="book-description">${book.description}</p>
                    </div>
                </div>
            </div>
        `;
        booksSection.append(bookCard);
    });
};

// View book details
const viewBookDetails = (bookId) => {
    const book = booksData.find(b => b.id === bookId);
    if (book) {
        M.toast({
            html: `Viewing: ${book.title} by ${book.author}`,
            classes: 'blue'
        });
    }
};

// Handle form submission
const submitBook = () => {
    const formData = {
        title: $('#book_title').val(),
        author: $('#book_author').val(),
        year: parseInt($('#book_year').val()),
        genre: $('#book_genre').val(),
        description: $('#book_description').val()
    };
    
    console.log('New Book Submitted:', formData);
    M.toast({html: 'Book added successfully!', classes: 'green'});
    
    // Close modal and reset form
    const modal = M.Modal.getInstance($('#addBookModal'));
    modal.close();
    $('#addBookForm')[0].reset();
    
};

// Document ready
$(document).ready(function() {
    // Initialize Materialize components
    initializeMaterialize();
    
    // Event listeners
    $('#loadBooksBtn').click(loadBooks);
    $('#submitBookBtn').click(submitBook);

    loadBooks();
    
    console.log('Books Library Application Initialized');
});