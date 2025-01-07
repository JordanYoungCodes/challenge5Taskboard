// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;


// Todo: create a function to generate a unique task id
function generateTaskId() {
  let currentID = nextId || 0;
  currentID++;
  localStorage.setItem("nextId", currentID);
  nextId = currentID; 
  return currentID;
}


// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>')
    .addClass('card w-75 task-card draggable my-3')
    .attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.description);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);


  cardDeleteBtn.on('click', handleDeleteTask);

  // set card background color based on due date
  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'MM/DD/YYYY');
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  $('#todo-cards, #in-progress-cards, #done-cards').empty(); 
  taskList.forEach(task => {
    const taskCard = createTaskCard(task);

    // Append task card to the correct swim lane based on its status
    if (task.status === 'to-do') {
      $('#todo-cards').append(taskCard);
    } else if (task.status === 'in-progress') {
      $('#in-progress-cards').append(taskCard);
    } else if (task.status === 'done') {
      $('#done-cards').append(taskCard);
    }
  });
  makeDraggable();
}


// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  // Gather task data from input fields
  const title = $('#task-title').val();
  const description = $('#task-desc').val();
  const dueDate = $('#task-due-date').val();

  if (!title || !description || !dueDate) {
    alert("Please fill in all fields");
    return;
  }

  const newTask = {
    id: generateTaskId(),
    title,
    description,
    dueDate,
    status: 'to-do' 
  };

  // Add new task to taskList and save it to localStorage
  taskList.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(taskList));

  // Create task card and append to "To Do" column
  const taskCard = createTaskCard(newTask);
  $('#todo-cards').append(taskCard);

  // Reapply draggable functionality to new task
  makeDraggable();

  // Clear form inputs after adding
  $('#task-title').val('');
  $('#task-desc').val('');
  $('#task-due-date').val('');
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).attr('data-task-id');
  
  taskList = taskList.filter(task => task.id !== parseInt(taskId));
  localStorage.setItem('tasks', JSON.stringify(taskList));

  $(this).closest('.card').remove();
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskCard = ui.draggable;
  const taskId = taskCard.attr('data-task-id');
  const newStatus = $(this).attr('id').replace('-cards', ''); 
  
  const task = taskList.find(t => t.id == taskId);
  task.status = newStatus;
  localStorage.setItem('tasks', JSON.stringify(taskList));

  $(this).append(taskCard);
}

function makeDraggable() {
  $(".draggable").draggable({
    zIndex: 100,
    revert: "invalid", 
    helper: "clone"
  });

  $(".lane").droppable({
    accept: ".draggable",
    over: function(event, ui) {
      $(this).addClass('highlight-droparea');
    },
    out: function(event, ui) {
      $(this).removeClass('highlight-droparea');
    },
    drop: handleDrop
  });
  
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  $('#task-due-date').datepicker({
    dateFormat: 'mm/dd/yy'
  });

  renderTaskList(); 
  makeDraggable();  


  $('.createTC').on('click', handleAddTask);
});




