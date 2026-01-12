/**
 * Task Manager Frontend Scripts
 * =============================
 * SIT725 Task 4.2P - Add a Database
 * Author: Shenal Fernando (s224324112)
 * 
 * Handles all client-side interactions for the Task Manager.
 */

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
            M.toast({html: `Loaded ${allTasks.length} tasks`, classes: 'green'});
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
            <div class="card task-card hoverable">
                <div class="card-content">
                    <span class="card-title truncate">
                        <i class="material-icons">${statusIcon}</i>
                        ${task.taskName}
                    </span>
                    <p class="task-description">${task.description}</p>
                    
                    <div class="divider" style="margin: 15px 0;"></div>
                    
                    <div class="task-meta">
                        <div class="task-meta-item">
                            <i class="material-icons tiny">person</i>
                            <span>${task.assignedTo}</span>
                        </div>
                        <div class="task-meta-item">
                            <i class="material-icons tiny">access_time</i>
                            <span>${task.estimatedHours}h estimated</span>
                        </div>
                        <div class="task-meta-item">
                            <span class="tech-tag">
                                <i class="material-icons tiny">code</i>
                                ${task.technology}
                            </span>
                        </div>
                    </div>
                    
                    <div class="task-badges" style="margin-top: 15px;">
                        <span class="badge-chip priority-${priorityClass}">
                            ${task.priority}
                        </span>
                        <span class="badge-chip status-${statusClass}">
                            ${task.status}
                        </span>
                    </div>
                </div>
                <div class="card-action">
                    <a href="#!" class="blue-text" onclick="deleteTask('${task._id}')">
                        <i class="material-icons tiny">delete</i> Delete
                    </a>
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
        estimatedHours: parseInt($('#estimatedHours').val()) || 0
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
                loadTasks(); // Reload tasks to show the new one
            } else {
                M.toast({html: response.message || 'Error creating task', classes: 'red'});
            }
        },
        error: function(xhr) {
            const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'Error creating task';
            M.toast({html: errorMsg, classes: 'red'});
        }
    });
}

/**
 * Delete a task
 */
function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    $.ajax({
        url: `/api/tasks/${taskId}`,
        method: 'DELETE',
        success: function(response) {
            if (response.statusCode === 200) {
                M.toast({html: 'Task deleted successfully!', classes: 'green'});
                loadTasks(); // Reload tasks
            } else {
                M.toast({html: response.message || 'Error deleting task', classes: 'red'});
            }
        },
        error: function(xhr) {
            const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'Error deleting task';
            M.toast({html: errorMsg, classes: 'red'});
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
            <div class="empty-state center-align">
                <i class="material-icons large grey-text">inbox</i>
                <h5 class="grey-text">No tasks found</h5>
                <p class="grey-text">Create a new task to get started or run: npm run seed</p>
                <a href="#addTaskModal" class="btn blue modal-trigger waves-effect waves-light">
                    <i class="material-icons left">add</i>Create Task
                </a>
            </div>
        </div>
    `);
}
