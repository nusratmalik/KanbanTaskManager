let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const columns = [todo, progress, done];

let dragElement = null;

// ------------------------
// Load Tasks
// ------------------------
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (!savedTasks) {
        updateCounts();
        return;
    }

    tasksData = savedTasks;

    for (const col in savedTasks) {
        const column = document.querySelector(`#${col}`);

        savedTasks[col].forEach(task => {
            createTask(task.title, task.desc, column);
        });
    }

    updateCounts();
}

// ------------------------
// Create Task
// ------------------------
function createTask(title, desc, column) {

    const div = document.createElement("div");

    div.className = "task";
    div.draggable = true;

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button class="delete-btn">Delete</button>
    `;

    // Drag Start
    div.addEventListener("dragstart", () => {
        dragElement = div;
    });

    // Delete
    div.querySelector(".delete-btn").addEventListener("click", () => {
        div.remove();
        saveTasks();
        updateCounts();
    });

    column.appendChild(div);
}

// ------------------------
// Save Tasks
// ------------------------
function saveTasks() {

    tasksData = {};

    columns.forEach(column => {

        tasksData[column.id] = [];

        column.querySelectorAll(".task").forEach(task => {

            tasksData[column.id].push({
                title: task.querySelector("h2").innerText,
                desc: task.querySelector("p").innerText
            });

        });

    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// ------------------------
// Update Counts
// ------------------------
function updateCounts() {

    todo.querySelector(".heading .right").textContent =
        todo.querySelectorAll(".task").length;

    progress.querySelector(".heading .right").textContent =
        progress.querySelectorAll(".task").length;

    done.querySelector(".heading .right").textContent =
        done.querySelectorAll(".task").length;
}

// ------------------------
// Drag Events
// ------------------------
function addDragEvents(column) {

    column.addEventListener("dragover", e => {
        e.preventDefault();
    });

    column.addEventListener("dragenter", e => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", () => {
        column.classList.remove("hover-over");
    });

    column.addEventListener("drop", e => {

        e.preventDefault();

        if (!dragElement) return;

        column.appendChild(dragElement);

        dragElement = null;

        column.classList.remove("hover-over");

        saveTasks();
        updateCounts();

    });

}

columns.forEach(addDragEvents);

// ------------------------
// Modal
// ------------------------
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .bg");

document.querySelector("#toggle-modal").addEventListener("click", () => {
    modal.classList.add("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

// ------------------------
// Add Task
// ------------------------
document.querySelector("#add-new-task").addEventListener("click", () => {

    const title = document.querySelector("#task-title-input").value.trim();
    const desc = document.querySelector("#task-desc-input").value.trim();

    if (!title) {
        alert("Please enter a task title.");
        return;
    }

    createTask(title, desc, todo);

    saveTasks();
    updateCounts();

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-desc-input").value = "";

    modal.classList.remove("active");

});

// ------------------------
// Initialize
// ------------------------
loadTasks();