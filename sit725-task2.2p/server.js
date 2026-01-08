/**
 * SIT725 Task 2.2P - Express Web Server
 * A simple calculator REST API demonstrating GET and POST methods
 * 
 * Author: Shenal
 * Date: January 2026
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies (for POST requests)
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// REST API ENDPOINTS - Calculator Operations
// ============================================

/**
 * GET /api/add
 * Adds two numbers passed as query parameters
 * Example: /api/add?num1=5&num2=3
 */
app.get('/api/add', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({
            success: false,
            error: 'Please provide valid numbers for num1 and num2'
        });
    }
    
    const result = num1 + num2;
    res.json({
        success: true,
        operation: 'addition',
        num1: num1,
        num2: num2,
        result: result
    });
});

/**
 * GET /api/subtract
 * Subtracts num2 from num1
 * Example: /api/subtract?num1=10&num2=4
 */
app.get('/api/subtract', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({
            success: false,
            error: 'Please provide valid numbers for num1 and num2'
        });
    }
    
    const result = num1 - num2;
    res.json({
        success: true,
        operation: 'subtraction',
        num1: num1,
        num2: num2,
        result: result
    });
});

/**
 * GET /api/multiply
 * Multiplies two numbers
 * Example: /api/multiply?num1=6&num2=7
 */
app.get('/api/multiply', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({
            success: false,
            error: 'Please provide valid numbers for num1 and num2'
        });
    }
    
    const result = num1 * num2;
    res.json({
        success: true,
        operation: 'multiplication',
        num1: num1,
        num2: num2,
        result: result
    });
});

/**
 * GET /api/divide
 * Divides num1 by num2
 * Example: /api/divide?num1=20&num2=4
 */
app.get('/api/divide', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    
    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({
            success: false,
            error: 'Please provide valid numbers for num1 and num2'
        });
    }
    
    if (num2 === 0) {
        return res.status(400).json({
            success: false,
            error: 'Cannot divide by zero'
        });
    }
    
    const result = num1 / num2;
    res.json({
        success: true,
        operation: 'division',
        num1: num1,
        num2: num2,
        result: result
    });
});

/**
 * POST /api/calculate
 * Performs calculation based on operation specified in body
 * Body: { "num1": 10, "num2": 5, "operation": "add" }
 * Operations: add, subtract, multiply, divide
 */
app.post('/api/calculate', (req, res) => {
    const { num1, num2, operation } = req.body;
    
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);
    
    if (isNaN(n1) || isNaN(n2)) {
        return res.status(400).json({
            success: false,
            error: 'Please provide valid numbers for num1 and num2'
        });
    }
    
    let result;
    let operationName;
    
    switch (operation) {
        case 'add':
            result = n1 + n2;
            operationName = 'addition';
            break;
        case 'subtract':
            result = n1 - n2;
            operationName = 'subtraction';
            break;
        case 'multiply':
            result = n1 * n2;
            operationName = 'multiplication';
            break;
        case 'divide':
            if (n2 === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot divide by zero'
                });
            }
            result = n1 / n2;
            operationName = 'division';
            break;
        default:
            return res.status(400).json({
                success: false,
                error: 'Invalid operation. Use: add, subtract, multiply, or divide'
            });
    }
    
    res.json({
        success: true,
        operation: operationName,
        num1: n1,
        num2: n2,
        result: result
    });
});

// ============================================
// Root endpoint - serves the main HTML page
// ============================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// Start the server
// ============================================
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║   SIT725 Task 2.2P - Express Calculator Server            ║
╠═══════════════════════════════════════════════════════════╣
║   Server running at: http://localhost:${PORT}               ║
╠═══════════════════════════════════════════════════════════╣
║   Available Endpoints:                                    ║
║   - GET  /api/add?num1=X&num2=Y                          ║
║   - GET  /api/subtract?num1=X&num2=Y                     ║
║   - GET  /api/multiply?num1=X&num2=Y                     ║
║   - GET  /api/divide?num1=X&num2=Y                       ║
║   - POST /api/calculate (body: num1, num2, operation)    ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
