const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB Connection (removed deprecated options)
mongoose.connect('mongodb://localhost:27017/taskManagerDB');

mongoose.connection.on('connected', () => {
    console.log('✓ Connected to MongoDB - taskManagerDB');
});

mongoose.connection.on('error', (err) => {
    console.error('✗ MongoDB connection error:', err);
});

// Define Task Schema
const TaskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    assignedTo: {
        type: String,
        required: true
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
        default: 0
    },
    technology: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', TaskSchema);

// REST API Endpoints

// GET all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({}).sort({ createdAt: -1 });
        res.json({ 
            statusCode: 200, 
            data: tasks, 
            message: 'Tasks retrieved successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            statusCode: 500, 
            message: 'Error retrieving tasks', 
            error: error.message 
        });
    }
});

// POST create new task
app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        res.json({ 
            statusCode: 201, 
            data: savedTask, 
            message: 'Task created successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            statusCode: 500, 
            message: 'Error creating task', 
            error: error.message 
        });
    }
});

// GET task by ID
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ 
                statusCode: 404, 
                message: 'Task not found' 
            });
        }
        res.json({ 
            statusCode: 200, 
            data: task, 
            message: 'Task retrieved successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            statusCode: 500, 
            message: 'Error retrieving task', 
            error: error.message 
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
