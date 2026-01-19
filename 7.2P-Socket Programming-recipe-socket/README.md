# Recipe Hub - Real-time Users Online Counter

## SIT725 - Applied Software Engineering | Task 7.2P

A Socket.IO demonstration showing real-time user tracking for the Recipe Management System.

##  Features

- **Live Users Counter** - See how many users are currently browsing
- **User List Display** - View all connected users with their generated chef names
- **Live Activity Feed** - Real-time notifications when users join, leave, or browse recipes
- **Recipe Interaction** - Click on recipes to simulate viewing (broadcasted to other users)
- **Connection Status** - Visual indicator showing socket connection status

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Socket.IO** - Real-time bidirectional communication
- **HTML/CSS/JavaScript** - Frontend

## Project Structure

```
recipe-socket-demo/
├── server.js           # Express server with Socket.IO setup
├── package.json        # Project dependencies
├── public/
│   ├── index.html      # Main HTML page
│   ├── styles.css      # CSS styling
│   └── scripts.js      # Client-side Socket.IO logic
└── README.md           # This file
```

##  How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

4. **Test real-time features:**
   - Open multiple browser tabs/windows
   - Watch the user count update in real-time
   - Click on recipes to see activity broadcasted to other tabs

##  Socket Events

### Server → Client
| Event | Description |
|-------|-------------|
| `welcome` | Sent when user connects, includes assigned chef name |
| `usersOnline` | Broadcasts current user count and list to all clients |
| `recipeActivity` | Notifies when another user views a recipe |

### Client → Server
| Event | Description |
|-------|-------------|
| `viewingRecipe` | Sent when user clicks on a recipe card |
| `disconnect` | Automatic when user closes tab/browser |

##Group 1 Members

- Shehan Perera (s215240027)
- Karan Sunilbhai Soni (s225576827)
- Janitha Jayasanka Bomiriya (s224715468)
- Anushi Amarasinghe (s224727365)
- Sarah Khaled O Alharbi (s224155072)
- Shenal Naveen Fernando (s224324112)

##  Screenshots

*Add screenshots of running application here*

##  References

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**SIT725 - Applied Software Engineering | Trimester 3, 2025**
