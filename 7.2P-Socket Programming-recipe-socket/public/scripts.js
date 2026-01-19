// Connect to Socket.IO server
const socket = io();

// DOM Elements
const userCountEl = document.getElementById('userCount');
const liveCountEl = document.getElementById('liveCount');
const connectionStatusEl = document.getElementById('connectionStatus');
const welcomeMessageEl = document.getElementById('welcomeMessage');
const yourNameEl = document.getElementById('yourName');
const usersListEl = document.getElementById('usersList');
const activityFeedEl = document.getElementById('activityFeed');
const onlineBadgeEl = document.getElementById('onlineBadge');

// Store current user's name
let myName = '';

// Handle welcome message from server
socket.on('welcome', (data) => {
    myName = data.yourName;
    welcomeMessageEl.textContent = data.message;
    yourNameEl.textContent = data.yourName;
    connectionStatusEl.textContent = 'Connected';
    connectionStatusEl.style.color = '#4CAF50';
    
    addActivity(`You joined as ${data.yourName}`, 'fa-sign-in-alt', true);
});

// Handle users online count update
socket.on('usersOnline', (data) => {
    // Update count displays
    userCountEl.textContent = data.count;
    liveCountEl.textContent = data.count;
    
    // Animate the badge
    onlineBadgeEl.style.transform = 'scale(1.1)';
    setTimeout(() => {
        onlineBadgeEl.style.transform = 'scale(1)';
    }, 200);
    
    // Update users list
    updateUsersList(data.users);
});

// Handle recipe activity from other users
socket.on('recipeActivity', (data) => {
    addActivity(`${data.user} is viewing "${data.recipe}"`, 'fa-eye', true);
});

// Handle connection events
socket.on('connect', () => {
    console.log('Connected to server');
    connectionStatusEl.textContent = 'Connected';
    connectionStatusEl.style.color = '#4CAF50';
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    connectionStatusEl.textContent = 'Disconnected';
    connectionStatusEl.style.color = '#f44336';
    addActivity('Connection lost. Reconnecting...', 'fa-exclamation-triangle', false);
});

socket.on('connect_error', () => {
    connectionStatusEl.textContent = 'Error';
    connectionStatusEl.style.color = '#f44336';
});

// Update the users list display
function updateUsersList(users) {
    if (users.length === 0) {
        usersListEl.innerHTML = '<p class="no-users">No users online yet...</p>';
        return;
    }
    
    usersListEl.innerHTML = users.map(user => `
        <div class="user-tag ${user === myName ? 'you' : ''}">
            <i class="fas fa-user-chef"></i>
            ${user}${user === myName ? ' (You)' : ''}
        </div>
    `).join('');
}

// Add activity to the feed
function addActivity(message, icon, isNew) {
    const activityItem = document.createElement('div');
    activityItem.className = `activity-item ${isNew ? 'new' : ''}`;
    activityItem.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <small style="margin-left: auto; color: #999;">${getTimeString()}</small>
    `;
    
    // Add to top of feed
    activityFeedEl.insertBefore(activityItem, activityFeedEl.firstChild);
    
    // Keep only last 10 activities
    while (activityFeedEl.children.length > 10) {
        activityFeedEl.removeChild(activityFeedEl.lastChild);
    }
}

// Get current time string
function getTimeString() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Function to simulate viewing a recipe (called from HTML onclick)
function viewRecipe(recipeName) {
    // Emit event to server
    socket.emit('viewingRecipe', { recipeName: recipeName });
    
    // Add local activity
    addActivity(`You are viewing "${recipeName}"`, 'fa-book-open', true);
    
    // Show a brief notification
    showNotification(`Now viewing: ${recipeName}`);
}

// Show notification toast
function showNotification(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animation for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    .user-tag.you {
        background: linear-gradient(135deg, #4CAF50, #45a049) !important;
    }
`;
document.head.appendChild(style);

// Log connection info
console.log('🍳 Recipe Hub Socket.IO Client Loaded');
console.log('📡 Connecting to server...');
