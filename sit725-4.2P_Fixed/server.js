/**
 * Server Entry Point
 * ==================
 * SIT725 Task 4.2P - Add a Database
 * Author: Shenal Fernando (s224324112)
 * 
 * This server file:
 * - Initializes Express application
 * - Connects to MongoDB via config/database.js (SINGLE connection point)
 * - Mounts routes from routes/taskRoutes.js
 * - Serves static files from public/
 * 
 * Project Structure:
 * ├── config/
 * │   └── database.js      <- Single MongoDB connection config
 * ├── models/
 * │   ├── Task.js          <- Single Task schema definition
 * │   └── index.js
 * ├── routes/
 * │   ├── taskRoutes.js    <- API route handlers
 * │   └── index.js
 * ├── public/
 * │   ├── css/styles.css
 * │   ├── js/scripts.js
 * │   └── index.html
 * ├── scripts/
 * │   └── seed.js          <- Separate seed script (uses same model)
 * └── server.js            <- This file (entry point)
 */

const express = require('express');
const path = require('path');

// Import database configuration (SINGLE source)
const { connectDB } = require('./config/database');

// Import routes
const { taskRoutes } = require('./routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// Middleware Configuration
// ============================================

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// API Routes
// ============================================

// Mount task routes at /api/tasks
app.use('/api/tasks', taskRoutes);

// ============================================
// Root Route
// ============================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// Error Handling
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        statusCode: 404,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        statusCode: 500,
        message: 'Internal server error'
    });
});

// ============================================
// Start Server
// ============================================

const startServer = async () => {
    try {
        // Connect to MongoDB using the config module
        await connectDB();
        
        // Start listening for requests
        app.listen(PORT, () => {
            console.log('');
            console.log('='.repeat(50));
            console.log('  SIT725 Task Manager Application');
            console.log('  Task 4.2P - Add a Database');
            console.log('='.repeat(50));
            console.log(`  ✓ Server running on http://localhost:${PORT}`);
            console.log(`  ✓ API endpoint: http://localhost:${PORT}/api/tasks`);
            console.log('='.repeat(50));
            console.log('');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    const { disconnectDB } = require('./config/database');
    await disconnectDB();
    process.exit(0);
});

// Start the server
startServer();
