/**
 * Task Routes
 * ===========
 * RESTful API endpoints for task management.
 * 
 * SIT725 4.2P - Add a Database
 * Author: Shenal Fernando (s224324112)
 */

const express = require('express');
const router = express.Router();
const { Task } = require('../models');

/**
 * GET /api/tasks
 * Retrieve all tasks
 */
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json({
            statusCode: 200,
            message: 'Tasks retrieved successfully',
            data: tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            statusCode: 500,
            message: 'Error fetching tasks',
            error: error.message
        });
    }
});

/**
 * GET /api/tasks/:id
 * Retrieve a single task by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Task not found'
            });
        }
        
        res.status(200).json({
            statusCode: 200,
            message: 'Task retrieved successfully',
            data: task
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({
            statusCode: 500,
            message: 'Error fetching task',
            error: error.message
        });
    }
});

/**
 * POST /api/tasks
 * Create a new task
 */
router.post('/', async (req, res) => {
    try {
        const { taskName, description, assignedTo, priority, status, estimatedHours, technology } = req.body;
        
        // Validate required fields
        if (!taskName) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Task name is required'
            });
        }
        
        // Create new task using the Task model
        const task = new Task({
            taskName,
            description,
            assignedTo,
            priority,
            status,
            estimatedHours,
            technology
        });
        
        // Save to database
        const savedTask = await task.save();
        
        console.log('✓ Task created:', savedTask.taskName);
        
        res.status(201).json({
            statusCode: 201,
            message: 'Task created successfully',
            data: savedTask
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            statusCode: 500,
            message: 'Error creating task',
            error: error.message
        });
    }
});

/**
 * PUT /api/tasks/:id
 * Update an existing task
 */
router.put('/:id', async (req, res) => {
    try {
        const { taskName, description, assignedTo, priority, status, estimatedHours, technology } = req.body;
        
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                taskName,
                description,
                assignedTo,
                priority,
                status,
                estimatedHours,
                technology
            },
            { new: true, runValidators: true }
        );
        
        if (!task) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Task not found'
            });
        }
        
        console.log('✓ Task updated:', task.taskName);
        
        res.status(200).json({
            statusCode: 200,
            message: 'Task updated successfully',
            data: task
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            statusCode: 500,
            message: 'Error updating task',
            error: error.message
        });
    }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        
        if (!task) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Task not found'
            });
        }
        
        console.log('✓ Task deleted:', task.taskName);
        
        res.status(200).json({
            statusCode: 200,
            message: 'Task deleted successfully',
            data: task
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            statusCode: 500,
            message: 'Error deleting task',
            error: error.message
        });
    }
});

module.exports = router;
