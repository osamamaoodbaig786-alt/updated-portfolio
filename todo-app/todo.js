let taskForm = document.querySelector("#taskForm");
let taskInput = document.querySelector("#taskInput");
let taskList = document.querySelector("#taskList");
let clearBtn = document.querySelector("#clearBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = -1;

displayTasks();

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    let li = document.createElement("li");

    li.innerHTML = `
      <span>${task}</span>
      <div>
        <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function editTask(index) {
  taskInput.value = tasks[index];
  editIndex = index;
  document.querySelector("#taskForm button[type='submit']").innerText = "Update Task";
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  displayTasks();
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  if (editIndex > -1) {
    tasks[editIndex] = taskText;
    editIndex = -1;
    document.querySelector("#taskForm button[type='submit']").innerText = "Add Task";
  } else {
    tasks.push(taskText);
  }

  saveTasks();
  displayTasks();
  taskInput.value = "";
});

clearBtn.addEventListener("click", function () {
  tasks = [];
  saveTasks();
  displayTasks();
});