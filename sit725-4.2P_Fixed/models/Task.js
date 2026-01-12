/**
 * Task Model
 * ==========
 * SINGLE source of truth for the Task schema.
 * This model is used by both the server routes AND the seed script.
 * 
 * SIT725 4.2P - Add a Database
 * Author: Shenal Fernando (s224324112)
 */

const mongoose = require('mongoose');

// ============================================
// TASK SCHEMA DEFINITION
// ============================================
const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: [true, 'Task name is required'],
        trim: true,
        maxlength: [100, 'Task name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        default: ''
    },
    assignedTo: {
        type: String,
        trim: true,
        default: 'Unassigned'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Testing', 'Completed'],
        default: 'To Do'
    },
    estimatedHours: {
        type: Number,
        min: [0, 'Estimated hours cannot be negative'],
        default: 0
    },
    technology: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
