let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  const columns = ["draft", "progress", "done"];

  // Clear all columns
  columns.forEach(id => {
    document.getElementById(id).innerHTML = "";
  });
const counts = { draft: 0, progress: 0, done: 0 };

tasks.forEach(t => counts[t.status]++);

document.getElementById("count-draft").innerText = counts.draft;
document.getElementById("count-progress").innerText = counts.progress;
document.getElementById("count-done").innerText = counts.done;
  // Add tasks
  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task";
    div.draggable = true;

  div.innerHTML = `
  <b>${task.text}</b><br><br>
  <button onclick="editTask(${index})">Edit</button>
  <button onclick="deleteTask(${index})">Delete</button>
`;
    // drag events
    div.addEventListener("dragstart", () => {
      div.classList.add("dragging");
      div.setAttribute("data-index", index);
    });

    div.addEventListener("dragend", () => {
      div.classList.remove("dragging");
    });

    document.getElementById(task.status).appendChild(div);
  });

  // Show "No tasks" ONLY if empty
  columns.forEach(id => {
    const column = document.getElementById(id);

    if (column.children.length === 0) {
      const p = document.createElement("p");
      p.className = "empty";
      p.innerText = "No tasks";
      column.appendChild(p);
    }
  });
}
function addTask() {
  const input = document.getElementById("taskInput");
  const status = document.getElementById("status").value;

  if(input.value === "") return;

  tasks.push({
    text: input.value,
    status: status
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  input.value = "";

  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function moveTask(index) {
  if(tasks[index].status === "draft") {
    tasks[index].status = "progress";
  } else if(tasks[index].status === "progress") {
    tasks[index].status = "done";
  } else {
    tasks[index].status = "draft";
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

renderTasks();
document.querySelectorAll(".task-list").forEach(column => {

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    const dragged = document.querySelector(".dragging");
    const index = dragged.getAttribute("data-index");

    const newStatus = column.id;

    tasks[index].status = newStatus;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  });

});
function editTask(index) {
  const updated = prompt("Edit task:", tasks[index].text);

  if (updated && updated.trim() !== "") {
    tasks[index].text = updated.trim();
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
}
document.getElementById("taskInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});