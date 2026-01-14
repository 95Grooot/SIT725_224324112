const chai = require('chai');
const expect = chai.expect;

const { calculateTotalPrice, applyDiscount, calculateAveragePrice } = require('../utils/priceCalculator');

describe('Price Calculator Functions', function() {
    
    // Test data
    const sampleBooks = [
        { id: 'b1', title: 'Book 1', price: '29.99' },
        { id: 'b2', title: 'Book 2', price: '22.00' },
        { id: 'b3', title: 'Book 3', price: '15.50' }
    ];

    // ========================================
    // Tests for applyDiscount function
    // ========================================
    describe('applyDiscount()', function() {
        
        // Test 1: Valid behaviour - normal discount
        it('should apply 10% discount correctly', function() {
            const result = applyDiscount(100, 10);
            expect(result).to.equal(90);
        });

        // Test 2: Valid behaviour - zero discount
        it('should return original price when discount is 0%', function() {
            const result = applyDiscount(29.99, 0);
            expect(result).to.equal(29.99);
        });

        // Test 3: Valid behaviour - 100% discount
        it('should return 0 when discount is 100%', function() {
            const result = applyDiscount(50, 100);
            expect(result).to.equal(0);
        });

        // Test 4: Edge case - decimal discount
        it('should handle decimal discount percentages', function() {
            const result = applyDiscount(100, 12.5);
            expect(result).to.equal(87.5);
        });

        // Test 5: Invalid behaviour - negative price
        it('should throw error for negative price', function() {
            expect(() => applyDiscount(-10, 10)).to.throw('Price cannot be negative');
        });

        // Test 6: Invalid behaviour - discount out of range
        it('should throw error for discount greater than 100', function() {
            expect(() => applyDiscount(100, 150)).to.throw('Discount must be between 0 and 100');
        });

        // Test 7: Invalid behaviour - negative discount
        it('should throw error for negative discount', function() {
            expect(() => applyDiscount(100, -10)).to.throw('Discount must be between 0 and 100');
        });

        // Test 8: Invalid behaviour - non-number price
        it('should throw error for non-number price', function() {
            expect(() => applyDiscount('abc', 10)).to.throw('Price must be a valid number');
        });
    });

    // ========================================
    // Tests for calculateTotalPrice function
    // ========================================
    describe('calculateTotalPrice()', function() {
        
        // Test 1: Valid behaviour - calculate total
        it('should calculate total price of books correctly', function() {
            const result = calculateTotalPrice(sampleBooks);
            expect(result).to.equal(67.49);
        });

        // Test 2: Edge case - empty array
        it('should return 0 for empty array', function() {
            const result = calculateTotalPrice([]);
            expect(result).to.equal(0);
        });

        // Test 3: Edge case - single book
        it('should handle single book correctly', function() {
            const result = calculateTotalPrice([{ price: '25.00' }]);
            expect(result).to.equal(25);
        });

        // Test 4: Invalid behaviour - non-array input
        it('should throw error for non-array input', function() {
            expect(() => calculateTotalPrice('not an array')).to.throw('Input must be an array');
        });

        // Test 5: Edge case - books with missing price
        it('should treat missing prices as 0', function() {
            const booksWithMissing = [
                { price: '10.00' },
                { title: 'No price' },
                { price: '20.00' }
            ];
            const result = calculateTotalPrice(booksWithMissing);
            expect(result).to.equal(30);
        });
    });

    // ========================================
    // Tests for calculateAveragePrice function
    // ========================================
    describe('calculateAveragePrice()', function() {
        
        // Test 1: Valid behaviour - calculate average
        it('should calculate average price correctly', function() {
            const result = calculateAveragePrice(sampleBooks);
            expect(result).to.equal(22.5); // 67.49 / 3 = 22.496... rounded to 22.5
        });

        // Test 2: Edge case - empty array
        it('should return 0 for empty array', function() {
            const result = calculateAveragePrice([]);
            expect(result).to.equal(0);
        });

        // Test 3: Invalid behaviour - non-array input
        it('should throw error for non-array input', function() {
            expect(() => calculateAveragePrice(null)).to.throw('Input must be an array');
        });
    });
});
