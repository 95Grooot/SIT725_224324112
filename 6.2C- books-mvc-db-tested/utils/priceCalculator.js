/**
 * Book Price Calculator Utility
 * Contains calculation functions for book pricing
 */

/**
 * Calculate the total price of multiple books
 * @param {Array} books - Array of book objects with price property
 * @returns {number} Total price rounded to 2 decimal places
 */
function calculateTotalPrice(books) {
    if (!Array.isArray(books)) {
        throw new Error('Input must be an array');
    }
    
    if (books.length === 0) {
        return 0;
    }
    
    const total = books.reduce((sum, book) => {
        const price = parseFloat(book.price) || 0;
        return sum + price;
    }, 0);
    
    return Math.round(total * 100) / 100;
}

/**
 * Apply discount to a book price
 * @param {number} price - Original price
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Discounted price rounded to 2 decimal places
 */
function applyDiscount(price, discountPercent) {
    if (typeof price !== 'number' || isNaN(price)) {
        throw new Error('Price must be a valid number');
    }
    
    if (price < 0) {
        throw new Error('Price cannot be negative');
    }
    
    if (typeof discountPercent !== 'number' || isNaN(discountPercent)) {
        throw new Error('Discount must be a valid number');
    }
    
    if (discountPercent < 0 || discountPercent > 100) {
        throw new Error('Discount must be between 0 and 100');
    }
    
    const discountedPrice = price * (1 - discountPercent / 100);
    return Math.round(discountedPrice * 100) / 100;
}

/**
 * Calculate average book price
 * @param {Array} books - Array of book objects with price property
 * @returns {number} Average price rounded to 2 decimal places
 */
function calculateAveragePrice(books) {
    if (!Array.isArray(books)) {
        throw new Error('Input must be an array');
    }
    
    if (books.length === 0) {
        return 0;
    }
    
    const total = calculateTotalPrice(books);
    return Math.round((total / books.length) * 100) / 100;
}

module.exports = {
    calculateTotalPrice,
    applyDiscount,
    calculateAveragePrice
};
