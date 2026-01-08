# SIT725 Task 2.2P - Express Web Server

A simple Express.js calculator web application demonstrating REST API concepts with GET and POST methods.

## Description

This project implements a basic calculator web service using Express.js. It demonstrates:
- HTTP GET requests with query parameters
- HTTP POST requests with JSON body
- Serving static files from the public directory
- RESTful API design principles

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd sit725-task2.2p
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the server
   ```bash
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## API Endpoints

### GET Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| /api/add | Adds two numbers | /api/add?num1=5&num2=3 returns 8 |
| /api/subtract | Subtracts num2 from num1 | /api/subtract?num1=10&num2=4 returns 6 |
| /api/multiply | Multiplies two numbers | /api/multiply?num1=6&num2=7 returns 42 |
| /api/divide | Divides num1 by num2 | /api/divide?num1=20&num2=4 returns 5 |

### POST Endpoint

POST /api/calculate

Request body:
```json
{
    "num1": 10,
    "num2": 5,
    "operation": "add"
}
```

Available operations: add, subtract, multiply, divide

Response:
```json
{
    "success": true,
    "operation": "addition",
    "num1": 10,
    "num2": 5,
    "result": 15
}
```

## Project Structure

```
sit725-task2.2p/
├── server.js          # Express server with API endpoints
├── package.json       # Project dependencies and scripts
├── README.md          # This file
└── public/
    └── index.html     # Frontend calculator interface
```

## Testing the API

### Using Browser (GET requests)

Simply navigate to:
- http://localhost:3000/api/add?num1=10&num2=5
- http://localhost:3000/api/subtract?num1=10&num2=5
- http://localhost:3000/api/multiply?num1=10&num2=5
- http://localhost:3000/api/divide?num1=10&num2=5

### Using cURL (Command Line)

GET Request:
```bash
curl "http://localhost:3000/api/add?num1=10&num2=5"
```

POST Request:
```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"num1": 10, "num2": 5, "operation": "add"}'
```

## Technologies Used

- Node.js - JavaScript runtime
- Express.js - Web application framework
- HTML/CSS/JavaScript - Frontend interface

## Author

Shenal - SIT725 Applied Software Engineering

## License

This project is for educational purposes as part of Deakin University's SIT725 unit.
