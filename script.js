/* ===================================
   To-Do List Application - JavaScript
   =================================== */

// ===== DOM Elements =====
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

// ===== Task Storage Key for localStorage =====
const STORAGE_KEY = "todoListTasks";

// ===================================
// Initialize Application
// ===================================

// Load tasks from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    updateEmptyMessage();
});

// ===================================
// Event Listeners
// ===================================

// Add task when "Add Task" button is clicked
addButton.addEventListener("click", addTask);

// Add task when Enter key is pressed
taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Clear input focus when task is added
taskInput.addEventListener("focus", () => {
    taskInput.style.borderColor = "#667eea";
});

// ===================================
// Core Functions
// ===================================

/**
 * Add a new task to the list
 */
function addTask() {
    // Get the input value and trim whitespace
    const taskText = taskInput.value.trim();

    // Validate: task must not be empty
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // Create task object
    const task = {
        id: Date.now(), // Use timestamp as unique ID
        text: taskText,
        completed: false,
    };

    // Get existing tasks from localStorage
    const tasks = getTasks();

    // Add new task to the array
    tasks.push(task);

    // Save tasks to localStorage
    saveTasks(tasks);

    // Clear the input field
    taskInput.value = "";

    // Reload the task list on the page
    loadTasks();

    // Update empty message visibility
    updateEmptyMessage();

    // Focus back to input for better UX
    taskInput.focus();
}

/**
 * Delete a task by its ID
 * @param {number} taskId - The unique ID of the task to delete
 */
function deleteTask(taskId) {
    // Get all tasks from localStorage
    let tasks = getTasks();

    // Filter out the task with the matching ID
    tasks = tasks.filter((task) => task.id !== taskId);

    // Save updated tasks to localStorage
    saveTasks(tasks);

    // Reload the task list
    loadTasks();

    // Update empty message visibility
    updateEmptyMessage();
}

/**
 * Toggle task completion status
 * @param {number} taskId - The unique ID of the task to toggle
 */
function toggleTask(taskId) {
    // Get all tasks from localStorage
    const tasks = getTasks();

    // Find the task and toggle its completed status
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
    }

    // Save updated tasks to localStorage
    saveTasks(tasks);

    // Reload the task list
    loadTasks();
}

/**
 * Load and display all tasks from localStorage
 */
function loadTasks() {
    // Clear the current task list
    taskList.innerHTML = "";

    // Get tasks from localStorage
    const tasks = getTasks();

    // Create HTML for each task and add to the list
    tasks.forEach((task) => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

/**
 * Create a task HTML element
 * @param {Object} task - Task object containing id, text, and completed status
 * @returns {HTMLElement} - The task list item element
 */
function createTaskElement(task) {
    // Create list item container
    const listItem = document.createElement("li");
    listItem.className = "task-item";

    // Add 'completed' class if task is completed
    if (task.completed) {
        listItem.classList.add("completed");
    }

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;

    // Add event listener to toggle task completion
    checkbox.addEventListener("change", () => {
        toggleTask(task.id);
    });

    // Create task text span
    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    // Add event listener to delete task
    deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
    });

    // Append all elements to the list item
    listItem.appendChild(checkbox);
    listItem.appendChild(taskText);
    listItem.appendChild(deleteButton);

    return listItem;
}

/**
 * Update the visibility of the empty message
 */
function updateEmptyMessage() {
    const tasks = getTasks();

    if (tasks.length === 0) {
        emptyMessage.classList.add("show");
    } else {
        emptyMessage.classList.remove("show");
    }
}

// ===================================
// localStorage Management
// ===================================

/**
 * Get all tasks from localStorage
 * @returns {Array} - Array of task objects
 */
function getTasks() {
    const tasksJSON = localStorage.getItem(STORAGE_KEY);

    // If no tasks exist, return empty array
    if (!tasksJSON) {
        return [];
    }

    // Parse and return tasks from JSON
    return JSON.parse(tasksJSON);
}

/**
 * Save tasks to localStorage
 * @param {Array} tasks - Array of task objects to save
 */
function saveTasks(tasks) {
    // Convert array to JSON string and save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
