// Global variables
let allTasks = [];

// Initialize on document ready
$(document).ready(function() {
    // Initialize Materialize components
    $('.modal').modal();
    $('select').formSelect();
    
    // Load tasks from server
    loadTasks();
    
    // Setup event listeners
    $('#filterStatus, #filterPriority').on('change', applyFilters);
});

/**
 * Load tasks from server via REST API
 */
function loadTasks() {
    $.get('/api/tasks', function(response) {
        if (response.statusCode === 200) {
            allTasks = response.data;
            displayTasks(allTasks);
            updateStats(allTasks);
        } else {
            M.toast({html: 'Error loading tasks', classes: 'red'});
        }
    }).fail(function() {
        M.toast({html: 'Failed to connect to server', classes: 'red'});
        showEmptyState();
    });
}

/**
 * Display tasks as cards
 */
function displayTasks(tasks) {
    const cardContainer = $('#taskCards');
    cardContainer.empty();
    
    if (tasks.length === 0) {
        showEmptyState();
        return;
    }
    
    tasks.forEach(task => {
        const card = createTaskCard(task);
        cardContainer.append(card);
    });
}

/**
 * Create individual task card HTML
 */
function createTaskCard(task) {
    const priorityClass = getPriorityClass(task.priority);
    const statusClass = getStatusClass(task.status);
    const statusIcon = getStatusIcon(task.status);
    
    return `
        <div class="col s12 m6 l4">
            <div class="card task-card">
                <div class="card-content">
                    <span class="card-title">
                        <i class="material-icons">${statusIcon}</i>
                        ${task.taskName}
                    </span>
                    <p class="task-description">${task.description}</p>
                    
                    <div class="task-meta">
                        <div class="task-meta-item">
                            <i class="material-icons">person</i>
                            <span>${task.assignedTo}</span>
                        </div>
                        <br>
                        <div class="task-meta-item">
                            <i class="material-icons">access_time</i>
                            <span>${task.estimatedHours}h</span>
                        </div>
                        <div class="task-meta-item">
                            <span class="tech-tag">
                                <i class="material-icons tiny">code</i>
                                ${task.technology}
                            </span>
                        </div>
                        <br>
                        <div class="task-meta-item">
                            <span class="priority-badge priority-${priorityClass}">
                                ${task.priority}
                            </span>
                        </div>
                        <div class="task-meta-item">
                            <span class="status-badge status-${statusClass}">
                                ${task.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get priority CSS class
 */
function getPriorityClass(priority) {
    const classes = {
        'Low': 'low',
        'Medium': 'medium',
        'High': 'high',
        'Critical': 'critical'
    };
    return classes[priority] || 'medium';
}

/**
 * Get status CSS class
 */
function getStatusClass(status) {
    const classes = {
        'To Do': 'todo',
        'In Progress': 'inprogress',
        'Testing': 'testing',
        'Completed': 'completed'
    };
    return classes[status] || 'todo';
}

/**
 * Get status icon
 */
function getStatusIcon(status) {
    const icons = {
        'To Do': 'playlist_add',
        'In Progress': 'cached',
        'Testing': 'bug_report',
        'Completed': 'check_circle'
    };
    return icons[status] || 'assignment';
}

/**
 * Update statistics cards
 */
function updateStats(tasks) {
    const stats = {
        completed: 0,
        inProgress: 0,
        todo: 0,
        testing: 0
    };
    
    tasks.forEach(task => {
        switch(task.status) {
            case 'Completed':
                stats.completed++;
                break;
            case 'In Progress':
                stats.inProgress++;
                break;
            case 'To Do':
                stats.todo++;
                break;
            case 'Testing':
                stats.testing++;
                break;
        }
    });
    
    $('#completedCount').text(stats.completed);
    $('#inProgressCount').text(stats.inProgress);
    $('#todoCount').text(stats.todo);
    $('#testingCount').text(stats.testing);
}

/**
 * Apply filters to task list
 */
function applyFilters() {
    const statusFilter = $('#filterStatus').val();
    const priorityFilter = $('#filterPriority').val();
    
    let filteredTasks = allTasks;
    
    if (statusFilter) {
        filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }
    
    if (priorityFilter) {
        filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }
    
    displayTasks(filteredTasks);
    
    M.toast({
        html: `Showing ${filteredTasks.length} task(s)`,
        classes: 'blue'
    });
}

/**
 * Submit new task to server
 */
function submitTask() {
    const taskData = {
        taskName: $('#taskName').val(),
        description: $('#description').val(),
        assignedTo: $('#assignedTo').val(),
        technology: $('#technology').val(),
        priority: $('#priority').val(),
        status: $('#status').val(),
        estimatedHours: parseInt($('#estimatedHours').val())
    };
    
    // Validate required fields
    if (!taskData.taskName || !taskData.description || !taskData.assignedTo || 
        !taskData.technology || !taskData.priority || !taskData.status) {
        M.toast({html: 'Please fill in all required fields', classes: 'orange'});
        return;
    }
    
    // Send POST request to server
    $.ajax({
        url: '/api/tasks',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(taskData),
        success: function(response) {
            if (response.statusCode === 201) {
                M.toast({html: 'Task created successfully!', classes: 'green'});
                $('#taskForm')[0].reset();
                $('.modal').modal('close');
                loadTasks(); // Reload tasks
            }
        },
        error: function() {
            M.toast({html: 'Error creating task', classes: 'red'});
        }
    });
}

/**
 * Show empty state when no tasks available
 */
function showEmptyState() {
    const cardContainer = $('#taskCards');
    cardContainer.html(`
        <div class="col s12">
            <div class="empty-state">
                <i class="material-icons">inbox</i>
                <h5>No tasks found</h5>
                <p>Create a new task to get started</p>
                <a href="#addTaskModal" class="btn blue modal-trigger waves-effect waves-light">
                    <i class="material-icons left">add</i>Create Task
                </a>
            </div>
        </div>
    `);
}
