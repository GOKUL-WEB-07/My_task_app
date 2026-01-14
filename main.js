// =======================
// STATE
// =======================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";
let dragIndex = null;

// =======================
// DOM
// =======================
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("searchInput");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");

const clearWrapper = document.getElementById("clearWrapper");
const clearAllText = document.getElementById("clearAllText");

const modalBackdrop = document.getElementById("modalBackdrop");
const cancelClear = document.getElementById("cancelClear");
const confirmClear = document.getElementById("confirmClear");

// =======================
// STORAGE
// =======================
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// =======================
// MODAL
// =======================
function openModal() {
  modalBackdrop.classList.remove("hidden");
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
}

// =======================
// CLEAR ALL EVENTS
// =======================
clearAllText.addEventListener("click", () => {
  if (tasks.length === 0) return;
  openModal();
});

cancelClear.addEventListener("click", closeModal);

confirmClear.addEventListener("click", () => {
  tasks = [];
  save();
  render();
  closeModal();
});

// =======================
// RENDER
// =======================
function render() {
  taskList.innerHTML = "";

  // Filter
  let filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  // Search
  const search = searchInput.value.toLowerCase();
  filteredTasks = filteredTasks.filter(task =>
    task.text.toLowerCase().includes(search)
  );

  // Render tasks
  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;
    li.draggable = true;

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? "checked" : ""} />

        <div class="task-content">
          <div class="task-title">
            <span class="task-text">${task.text}</span>
            <span class="priority ${task.priority}">
              ${task.priority}
            </span>
          </div>
          <small class="task-time">${task.time}</small>
        </div>
      </div>

      <div class="actions">
        <button class="edit">✏️</button>
        <button class="delete">🗑️</button>
      </div>
    `;

    // Checkbox
    li.querySelector("input").addEventListener("change", () => {
      task.completed = !task.completed;
      save();
      render();
    });

    // Edit
    li.querySelector(".edit").addEventListener("click", () => {
      editTask(index);
    });

    // Delete
    li.querySelector(".delete").addEventListener("click", () => {
      deleteTask(index);
    });

    // Drag & Drop
    li.addEventListener("dragstart", () => {
      dragIndex = index;
      li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
    });

    li.addEventListener("dragover", e => e.preventDefault());

    li.addEventListener("drop", () => {
      const dragged = tasks.splice(dragIndex, 1)[0];
      tasks.splice(index, 0, dragged);
      save();
      render();
    });

    taskList.appendChild(li);
  });

  // Counters
  totalCount.textContent = tasks.length;
  completedCount.textContent = tasks.filter(t => t.completed).length;

  // Show / hide Clear All (ONLY ONCE)
  if (tasks.length > 0) {
    clearWrapper.classList.remove("hidden");
  } else {
    clearWrapper.classList.add("hidden");
  }
}

// =======================
// ACTIONS
// =======================
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    text,
    priority: priorityInput.value,
    completed: false,
    time: new Date().toLocaleString()
  });

  taskInput.value = "";
  save();
  render();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  save();
  render();
}

function editTask(index) {
  const updated = prompt("Edit task", tasks[index].text);
  if (!updated) return;

  tasks[index].text = updated.trim();
  save();
  render();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}


// =======================
// EVENTS
// =======================
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

searchInput.addEventListener("input", render);

document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  });
});

// =======================
// INIT
// =======================
render();
