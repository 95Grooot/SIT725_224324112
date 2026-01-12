/**
 * Database Seed Script
 * ====================
 * SIT725 Task 4.2P - Add a Database
 * Author: Shenal Fernando (s224324112)
 * 
 * IMPORTANT: This script uses the SAME database configuration
 * and Task model as the main server to ensure consistency.
 * 
 * Usage: npm run seed
 * 
 * This is a STANDALONE script - it does NOT run with the server.
 * Run it once to populate initial data.
 */

// Import shared database configuration (SAME as server uses)
const { connectDB, disconnectDB } = require('../config/database');

// Import shared Task model (SAME as server uses)
const { Task } = require('../models');

// ============================================
// SAMPLE TASK DATA
// ============================================
const sampleTasks = [
    {
        taskName: 'Implement User Authentication',
        description: 'Build JWT-based authentication system with refresh tokens and secure password hashing',
        assignedTo: 'Sarah Mitchell',
        priority: 'High',
        status: 'In Progress',
        estimatedHours: 16,
        technology: 'Node.js & JWT'
    },
    {
        taskName: 'Design Database Schema',
        description: 'Create normalized database schema for e-commerce platform with proper relationships',
        assignedTo: 'David Chen',
        priority: 'Critical',
        status: 'Completed',
        estimatedHours: 12,
        technology: 'MongoDB'
    },
    {
        taskName: 'Build REST API Endpoints',
        description: 'Develop RESTful API endpoints for product catalog with pagination and filtering',
        assignedTo: 'Emily Rodriguez',
        priority: 'High',
        status: 'In Progress',
        estimatedHours: 20,
        technology: 'Express.js'
    },
    {
        taskName: 'Configure CI/CD Pipeline',
        description: 'Set up automated testing and deployment pipeline using GitHub Actions',
        assignedTo: 'Michael Brown',
        priority: 'Medium',
        status: 'To Do',
        estimatedHours: 8,
        technology: 'GitHub Actions'
    },
    {
        taskName: 'Create Unit Tests',
        description: 'Write comprehensive unit tests for authentication and API modules',
        assignedTo: 'Jessica Lee',
        priority: 'High',
        status: 'Testing',
        estimatedHours: 14,
        technology: 'Jest & Mocha'
    },
    {
        taskName: 'Frontend Dashboard Development',
        description: 'Build responsive admin dashboard with data visualization components',
        assignedTo: 'Alex Thompson',
        priority: 'Medium',
        status: 'In Progress',
        estimatedHours: 24,
        technology: 'React.js'
    },
    {
        taskName: 'API Documentation',
        description: 'Create comprehensive API documentation using Swagger/OpenAPI specification',
        assignedTo: 'Chris Wang',
        priority: 'Low',
        status: 'To Do',
        estimatedHours: 6,
        technology: 'Swagger'
    },
    {
        taskName: 'Performance Optimization',
        description: 'Optimize database queries and implement caching for frequently accessed data',
        assignedTo: 'Sarah Mitchell',
        priority: 'Medium',
        status: 'Testing',
        estimatedHours: 10,
        technology: 'Redis & MongoDB'
    }
];

/**
 * Seed the database with sample tasks
 */
const seedDatabase = async () => {
    try {
        console.log('');
        console.log('='.repeat(50));
        console.log('  Database Seeding Script');
        console.log('  SIT725 4.2P - Task Manager');
        console.log('='.repeat(50));
        console.log('');
        
        // Connect to database using shared config
        await connectDB();
        
        // Clear existing tasks
        console.log('  Clearing existing tasks...');
        await Task.deleteMany({});
        console.log('  ✓ Existing tasks cleared');
        
        // Insert sample tasks
        console.log('');
        console.log('  Inserting sample tasks...');
        const insertedTasks = await Task.insertMany(sampleTasks);
        
        console.log(`  ✓ Successfully inserted ${insertedTasks.length} tasks`);
        console.log('');
        
        // Display inserted tasks
        console.log('  Inserted Tasks:');
        console.log('  ' + '-'.repeat(46));
        insertedTasks.forEach((task, index) => {
            console.log(`  ${index + 1}. ${task.taskName}`);
            console.log(`     Status: ${task.status} | Priority: ${task.priority}`);
        });
        
        console.log('');
        console.log('='.repeat(50));
        console.log('  ✓ Seeding completed successfully!');
        console.log('='.repeat(50));
        console.log('');
        
    } catch (error) {
        console.error('');
        console.error('  ✗ Seeding failed:', error.message);
        console.error('');
    } finally {
        // Always disconnect after seeding
        await disconnectDB();
        process.exit(0);
    }
};

// Run the seed function
seedDatabase();
