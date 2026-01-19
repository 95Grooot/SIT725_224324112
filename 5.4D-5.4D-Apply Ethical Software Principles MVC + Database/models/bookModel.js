const mongoose = require('mongoose');

// Allowed fields for safe writes - reject any extra fields
const ALLOWED_FIELDS = ['id', 'title', 'author', 'year', 'genre', 'summary', 'price'];

// Valid genres for books
const VALID_GENRES = [
    'Science Fiction',
    'Classic',
    'Historical Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Thriller',
    'Non-Fiction',
    'Biography',
    'Other'
];

// Define Book schema with comprehensive validation rules
const BookSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: [true, 'Book ID is required'],
        unique: true, 
        index: true,
        trim: true,
        minlength: [2, 'Book ID must be at least 2 characters'],
        maxlength: [20, 'Book ID cannot exceed 20 characters'],
        match: [/^[a-zA-Z0-9_-]+$/, 'Book ID can only contain letters, numbers, underscores, and hyphens']
    },
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true,
        minlength: [1, 'Title must be at least 1 character'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: { 
        type: String, 
        required: [true, 'Author is required'],
        trim: true,
        minlength: [2, 'Author name must be at least 2 characters'],
        maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    year: { 
        type: Number, 
        required: [true, 'Publication year is required'],
        min: [1000, 'Year must be 1000 or later'],
        max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
        validate: {
            validator: Number.isInteger,
            message: 'Year must be a whole number'
        }
    },
    genre: { 
        type: String, 
        required: [true, 'Genre is required'],
        trim: true,
        enum: {
            values: VALID_GENRES,
            message: 'Genre must be one of: ' + VALID_GENRES.join(', ')
        }
    },
    summary: { 
        type: String, 
        required: [true, 'Summary is required'],
        trim: true,
        minlength: [10, 'Summary must be at least 10 characters'],
        maxlength: [2000, 'Summary cannot exceed 2000 characters']
    },
    price: { 
        type: mongoose.Decimal128, 
        required: [true, 'Price is required'],
        get: v => v?.toString(),
        validate: {
            validator: function(v) {
                const numValue = parseFloat(v.toString());
                return !isNaN(numValue) && numValue >= 0 && numValue <= 10000;
            },
            message: 'Price must be a valid number between 0 and 10000'
        }
    },
    currency: { 
        type: String, 
        required: true, 
        default: 'AUD',
        enum: {
            values: ['AUD'],
            message: 'Currency must be AUD'
        }
    }
}, {
    timestamps: true,
    toJSON: { getters: true, virtuals: false, transform(_doc, ret) { delete ret.__v; return ret; } },
    toObject: { getters: true, virtuals: false }
});

// Static method to validate allowed fields (rejects unexpected/malicious fields)
BookSchema.statics.validateAllowedFields = function(data, isUpdate = false) {
    const extraFields = Object.keys(data).filter(key => !ALLOWED_FIELDS.includes(key));
    if (extraFields.length > 0) {
        const error = new Error(`Unexpected fields not allowed: ${extraFields.join(', ')}`);
        error.name = 'ExtraFieldsError';
        throw error;
    }
    
    // For updates, id should not be changed
    if (isUpdate && data.hasOwnProperty('id')) {
        const error = new Error('Book ID cannot be modified');
        error.name = 'ImmutableFieldError';
        throw error;
    }
    
    return true;
};

// Static method to sanitize input data
BookSchema.statics.sanitizeInput = function(data) {
    const sanitized = {};
    ALLOWED_FIELDS.forEach(field => {
        if (data.hasOwnProperty(field)) {
            sanitized[field] = data[field];
        }
    });
    return sanitized;
};

// Export constants for use in other files
BookSchema.statics.ALLOWED_FIELDS = ALLOWED_FIELDS;
BookSchema.statics.VALID_GENRES = VALID_GENRES;

module.exports = mongoose.model('Book', BookSchema);
