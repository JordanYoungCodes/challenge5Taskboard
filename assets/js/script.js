// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  let curantID = JSON.parse(localStorage.getItem("nextId")) || 0
  curantID++
  localStorage.setItem("nextId", curantID)
  return curantID
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  console.log(task)
  //  const taskCard = $('div').addClass('card border-light mb-3 lane flex-grow-1 draggable').attr('data-task-id', task.id)
  //  const bodyContainer = $('div').attr('class', 'card-body bg-light ui-widget-content')
  //  const titleContainer = $('div').addClass('card-header bg-white')
  //  const taskcard4 = $('div').addClass('card-header')
  //  const taskcard5 = $('div').addClass('card-body')
  //  const tcButton = $('buttton').attr('type', 'button')
  //   .attr('class', 'btn btn-danger m-3')
  //   .text('Remove Task')

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
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn)
    taskCard.append(cardBody, cardHeader)
    return taskcard
}
console.log(createTaskCard())
// Todo: create a function to render the task list and make cards draggable
$(function () {
  $(".draggable").draggable({
    zIndex: 100,

  });

});
// Todo: create a function to handle adding a new task
function handleAddTask(event) {

  event.createTaskCard()

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  $('#datepicker').datepicker({
    changeMonth: true,
    changeYear: true,
  });

});
console.log(generateTaskId("hello world"))





$(".createTC").click(function () {

})

$('.lane').droppable({
  accept: '.draggable',
  drop: handleDrop,
});