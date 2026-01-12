# SIT725 Task 4.2P - Add a Database

**Author:** Shenal Fernando (s224324112)  
**Tutor:** Anthony De Silva  
**Date:** December 2025

## Project Overview

This is a Task Manager application that demonstrates MongoDB database integration with a Node.js/Express backend.

## Issues Fixed (Based on Tutor Feedback)

The original code had the following problems that have been addressed:

### 1. Multiple MongoDB Connections 
**Before:** Different files connected to different databases (`myprojectDB`, `taskManagerDB`)  
**After:** Single database configuration in `config/database.js` used by ALL modules

### 2. Mixed Schemas from Different Examples 
**Before:** `seed.js` had a `ProjectSchema` with kittens data, while the server used `Task` schema  
**After:** Single `Task` model in `models/Task.js` used by BOTH server and seed script

### 3. Code Not Properly Separated 
**Before:** Server logic, database connections, and models were mixed together  
**After:** Clear folder structure with separated responsibilities

## Project Structure

```
4.2P Add a database/
├── config/
│   └── database.js          # SINGLE MongoDB connection configuration
├── models/
│   ├── Task.js              # SINGLE Task schema definition
│   └── index.js             # Model exports
├── routes/
│   ├── taskRoutes.js        # API route handlers (CRUD operations)
│   └── index.js             # Route exports
├── public/
│   ├── css/
│   │   └── styles.css       # Application styles
│   ├── js/
│   │   └── scripts.js       # Frontend JavaScript
│   └── index.html           # Main HTML page
├── scripts/
│   └── seed.js              # Database seeding (uses SAME config & model)
├── server.js                # Entry point (imports from modules)
├── package.json
└── README.md
```

## Key Design Decisions

### Single Database Configuration
```javascript
// config/database.js - THE ONLY PLACE where MongoDB connection is defined
const DB_NAME = 'taskManagerDB';
const MONGODB_URI = `mongodb://localhost:27017/${DB_NAME}`;
```

### Shared Task Model
Both `server.js` (via routes) and `scripts/seed.js` import from the same model:
```javascript
const { Task } = require('../models');  // or require('./models')
```

### Separated Seed Script
The seed script is now:
- A **standalone script** (not mixed with server code)
- Uses the **same database config** as the server
- Uses the **same Task model** as the server
- Run separately with `npm run seed`

## Installation & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running on `localhost:27017`

### 3. Seed the Database (Optional - Run Once)
```bash
npm run seed
```

### 4. Start the Server
```bash
npm start
```

### 5. Access the Application
Open browser to: `http://localhost:3001`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Features

- View all tasks with filtering by status and priority
- Create new tasks via modal form
- Delete tasks
- Statistics dashboard (Completed, In Progress, To Do, Testing)
- Responsive design with Materialize CSS
- MongoDB integration with Mongoose ODM

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Frontend:** HTML5, CSS3, JavaScript, jQuery
- **UI Framework:** Materialize CSS


