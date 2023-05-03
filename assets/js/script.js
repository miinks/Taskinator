var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelectorAll("#page-content");


var tasks = [];

var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;


  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }


document.querySelector("input[name='task-name']").value = "";
document.querySelector("select[name='task-type']").selectedIndex = 0;

var isEdit = formEl.hasAttribute("data-task-id");


if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
} else {
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
    status: "to do"
  };

  createTaskEl(taskDataObj);
    }
};

var createTaskEl = function(taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = 
      "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
  
    switch (taskDataObj.status) {
      case "to do":
        taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
        tasksToDoEl.append(listItemEl);
        break;
      case "in progress":
        taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
        tasksInProgressEl.append(listItemEl);
        break;
      case "completed":
        taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
        tasksCompletedEl.append(listItemEl);
        break;
      default:
        console.log("Something went wrong!");
    }


    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);


    saveTasks();


    taskIdCounter++;
  };
  
var createTaskActions = function (taskId) {

var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";


var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);

var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);

var statusSelectEl = document.createElement("select");
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    statusSelectEl.className = "select-status";
    actionContainerEl.appendChild(statusSelectEl);

var statusChoices = ["To Do", "In Progress", "Completed"];

for (var i = 0; i < statusChoices.length; i++) {

    var statusOptionEl = document.createElement("option");
    statusOptionEl.setAttribute("value", statusChoices[i]);

    statusOptionEl.textContent = statusChoices[i];

    statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
  };

var completeEditTask = function (taskName, taskType, taskId) {

    var taskSelected = document.querySelector(
      ".task-item[data-task-id='" + taskId + "']"
      );

   
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;


  for (var i = 0; i < tasks.length; i++) {
   if (tasks[i].id === parseInt(taskId)){
    tasks[i].name = taskName;
    tasks[i].type = taskType;
   }
  }
  
    alert("Task Updated!");


    formEl.removeAttribute("data-task-id");

    formEl.querySelector("#save-task").textContent = "Add Task";

    saveTasks();
};

var taskButtonHandler = function (event) {

    var targetEl = event.target;

    if (targetEl.matches(".edit-btn")) {
        console.log("edit", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
      } else if (targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
      }
    };

 var taskStatusChangeHandler = function (event) {
  console.log(event.target.value);

     
    var taskId = event.target.getAttribute("data-task-id");

    var taskSelected = document.querySelector(
      ".task-item[data-task-id='" + taskId + "']"
      );


    var statusValue = event.target.value.toLowerCase();

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }


  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }


  saveTasks();

};

var editTask = function(taskId) {
  console.log(taskId);

 var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
    );
  

  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);
  
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  console.log(taskType);


  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;


  formEl.setAttribute("data-task-id", taskId);

  formEl.querySelector("#save-task").textContent = "Save Task";
};

var deleteTask = function(taskId) {
  console.log(taskId);

  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
    );
  taskSelected.remove();


  var updatedTaskArr = [];


  for (var i = 0; i < tasks.length; i++) {

    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }


  tasks = updatedTaskArr;
  saveTasks();
};

  var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) {
      return false;
    }
    console.log("Saved task found!");



    savedTasks = JSON.parse(savedTasks);
    
    for (var i = 0; i < savedTasks.length; i++) {

      createTaskEl(savedTasks[i]);
    }
  };



formEl.addEventListener("submit", taskFormHandler);


pageContentEl.addEventListener("click", taskButtonHandler);


pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();    
  

