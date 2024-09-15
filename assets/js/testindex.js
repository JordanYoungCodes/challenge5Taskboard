// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

// Function to generate a unique task id
function generateTaskId() {
  let currentID = JSON.parse(localStorage.getItem("nextId")) || 0;
  currentID++;
  localStorage.setItem("nextId", currentID);
  return currentID;
}

// Function to create a task card
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

  // Set card background color based on due date
  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
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

// Function to render task list from localStorage
function renderTaskList() {
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
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  // Gather task data
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
    status: 'to-do' // Default status when a task is first created
  };

  // Add task to task list
  taskList.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(taskList));

  // Create task card and append to "To Do" column
  const taskCard = createTaskCard(newTask);
  $('#todo-cards').append(taskCard);

  // Reapply draggable functionality
  makeDraggable();

  // Clear form
  $('#task-title').val('');
  $('#task-desc').val('');
  $('#task-due-date').val('');

  // Close modal
  $('#formModal').modal('hide');
}

// Function to handle task deletion
function handleDeleteTask(event) {
  const taskId = $(this).attr('data-task-id');
  
  // Remove task from taskList
  taskList = taskList.filter(task => task.id !== parseInt(taskId));
  localStorage.setItem('tasks', JSON.stringify(taskList));

  // Remove task card from DOM
  $(this).closest('.card').remove();
}

// Make tasks draggable
function makeDraggable() {
  $(".draggable").draggable({
    zIndex: 100,
    revert: "invalid", 
    helper: "clone"
  });


  $(".dropArea").droppable({
    accept: ".draggable",
    over: function(event, ui) {
      // Add highlighting when a draggable enters the drop area
      $(this).addClass('highlight-droparea');
    },
    out: function(event, ui) {
      // Remove highlighting when a draggable leaves the drop area
      $(this).removeClass('highlight-droparea');
    },
    drop: function(event, ui) {
      // On drop, append the draggable item and remove the highlight
      const taskCard = ui.draggable;
      $(this).append(taskCard);
      $(this).removeClass('highlight-droparea');  // Remove highlight on drop

      // Update task status based on where it's dropped
      const taskId = taskCard.attr('data-task-id');
      const newStatus = $(this).attr('id').replace('-cards', ''); // Remove "-cards" from the id to get the new status

      const task = taskList.find(t => t.id == taskId);
      task.status = newStatus;

      localStorage.setItem('tasks', JSON.stringify(taskList));
    }
  });
  
}

// Initialize date picker and make tasks draggable on page load
$(document).ready(function() {
  $('#task-due-date').datepicker({
    dateFormat: 'dd/mm/yy'
  });

  renderTaskList(); // Render tasks from localStorage
  makeDraggable();  // Apply draggable/droppable functionality
});

// Event listener for the Save button in the modal
$('#save-task-btn').on('click', handleAddTask);
