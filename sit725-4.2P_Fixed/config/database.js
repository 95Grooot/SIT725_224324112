/**
 * Database Configuration
 * ======================
 * SINGLE point of MongoDB connection for the entire application.
 * All modules should import from here to ensure consistency.
 * 
 * SIT725 4.2P - Add a Database
 * Author: Shenal Fernando (s224324112)
 */

const mongoose = require('mongoose');

// ============================================
// DATABASE CONFIGURATION - SINGLE SOURCE
// ============================================
const DB_NAME = 'taskManagerDB';
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${DB_NAME}`;

/**
 * Connect to MongoDB
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`✓ Connected to MongoDB - ${DB_NAME}`);
        console.log(`  Host: ${conn.connection.host}`);
        console.log(`  Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error('✗ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

/**
 * Disconnect from MongoDB
 * @returns {Promise} Disconnect promise
 */
const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('✓ MongoDB connection closed');
    } catch (error) {
        console.error('✗ Error closing MongoDB connection:', error.message);
    }
};

module.exports = {
    connectDB,
    disconnectDB,
    MONGODB_URI,
    DB_NAME
};
