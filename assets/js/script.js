var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event) {
    event.preventDefault();

var taskNameInput = document.querySelector("input[name='task-name']").value;
var taskTypeInput = document.querySelector("select[name='task-type']").value;

if (!taskNameInput === "" || !taskTypeInput === "") {
    alert("You need to fill out the task form!");
    return false;
  }

formEl.reset();

document.querySelector("input[name='task-name']").value = "";
document.querySelector("select[name='task-type']").selectedIndex = 0;

var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
  };

  createTaskEl(taskDataObj);
  var createTaskActions = function(taskId) {

  };



};
var createTaskEl = function(taskDataObj) {

    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    listItemEl.setAttribute("data-task-id", taskIdCounter);


    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    console.dir(listItemEl);

    tasksToDoEl.appendChild(listItemEl);

    taskIdCounter++;
  };

  formEl.addEventListener("submit", taskFormHandler);
