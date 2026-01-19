const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Track connected users
let onlineUsers = 0;
let usersList = []; // Store user info for more detail

// Socket.IO connection handling
io.on('connection', (socket) => {
    // New user connected
    onlineUsers++;
    
    // Generate a random guest name for the user
    const guestName = `Chef_${Math.floor(Math.random() * 9000) + 1000}`;
    usersList.push({ id: socket.id, name: guestName });
    
    console.log(` ${guestName} connected. Total online: ${onlineUsers}`);
    
    // Send the current count to the newly connected user
    socket.emit('welcome', { 
        message: `Welcome to Recipe Hub, ${guestName}!`,
        yourName: guestName 
    });
    
    // Broadcast updated count to ALL connected clients
    io.emit('usersOnline', { 
        count: onlineUsers,
        users: usersList.map(u => u.name)
    });
    
    // Handle user browsing a recipe (optional feature)
    socket.on('viewingRecipe', (data) => {
        console.log(` ${guestName} is viewing: ${data.recipeName}`);
        // Broadcast to others that someone is viewing a recipe
        socket.broadcast.emit('recipeActivity', {
            user: guestName,
            recipe: data.recipeName,
            action: 'viewing'
        });
    });
    
    // Handle user disconnect
    socket.on('disconnect', () => {
        onlineUsers--;
        usersList = usersList.filter(u => u.id !== socket.id);
        
        console.log(` ${guestName} disconnected. Total online: ${onlineUsers}`);
        
        // Broadcast updated count to remaining clients
        io.emit('usersOnline', { 
            count: onlineUsers,
            users: usersList.map(u => u.name)
        });
    });
});

// Basic API route
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'Server running',
        onlineUsers: onlineUsers 
    });
});

// Start server
server.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
    console.log(` Socket.IO ready for real-time connections`);
});
