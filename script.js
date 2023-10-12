// DOM Elements
const taskInput = document.getElementById('task-input');
const submitBtn = document.getElementById('submit-btn');
const completedTasks = document.getElementById('completed-tasks')
const emptyTask = document.getElementById('empty-task');
const taskTemplate = document.getElementById('task-template');
const tasks = document.getElementById('tasks');

// Get tasksArray from localStorage or create empty array
const LOCAL_STORAGE_KEY = 'task.list';
const tasksArray = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];


function createTask(name) {
    // Create task object and push it to tasksArray
    const id = Date.now().toString();
    const task = { name, id, completed: false };
    tasksArray.push(task);
    createTaskElement(task);
    updateCompletedTasks();
    save();
}

function createTaskElement(task) {
    // Create task element and append it to tasks
    const taskElement = taskTemplate.content.cloneNode(true);
    const listEl = taskElement.querySelector('li');
    const div = listEl.querySelector('div');
    div.innerText = task.name;
    listEl.id = task.id;
    tasks.appendChild(taskElement);
}

function deleteTaskElement(el) {
    // Delete task element from DOM and task with the same id from tasksArray
    const index = getIndexById(el);
    el.remove();
    tasksArray.splice(index, 1);
    updateCompletedTasks();
}

function renderTasks() {
    // Render all tasks from tasksArray
    tasksArray.forEach(task => {
        createTaskElement(task);
        if(task.completed) {
            const el = document.getElementById(task.id);
            el.classList.add('completed');
        }
    });
    updateCompletedTasks();
}

function save() {
    // Save tasksArray to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasksArray));
}

function toggleComplete(el) {
    // Get index of element in tasksArray and toggle completed class and property in tasksArray
    const index = getIndexById(el);
    if (index < 0) return
    el.classList.toggle('completed');
    tasksArray[index].completed = !tasksArray[index].completed;
}

function getIndexById(el) {
    // Get index of element in tasksArray by id and return it
    return tasksArray.findIndex(task => task.id === el.id);
}

function updateCompletedTasks() {
    // Update number of completed tasks
    tasksArray.length > 0 ? completedTasks.innerText = `Completed: ${tasksArray.filter(task => task.completed).length} / ${tasksArray.length}` : completedTasks.innerText = 'Completed: 0';
    save();
}

function handleClick() {
    // Get task from input and create task if it's not empty
    const task = taskInput.value.trim();
    if (task.length > 0) {
        createTask(task);
        taskInput.value = '';
        emptyTask.style.display = 'none';
    } else {
        emptyTask.style.display = 'block';
    }
}

submitBtn.addEventListener('click', (e) => {
    // Prevent default to prevent browser refresh
    e.preventDefault();
    handleClick();
});

// Add event listener to tasks container and check if click was on li, div or i
tasks.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'li') {
        // If li was clicked toggle completed class and property in tasksArray
        toggleComplete(e.target);
        updateCompletedTasks();
    }
    if(e.target.tagName.toLowerCase() === 'div') {
        // If div was clicked get parent element (li) and toggle completed class and property in tasksArray
        toggleComplete(e.target.parentElement);
        updateCompletedTasks();
    }
    if(e.target.tagName.toLowerCase() === 'i') {
        // If i was clicked get parent element (li) and delete it
        deleteTaskElement(e.target.parentElement);
    }
});

// Initial render
renderTasks()