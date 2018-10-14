var $buttonAddTask = document.getElementById('button-add-task');
$buttonAddTask.onclick = addNewTaskHandler;
var $divTasksDone = document.getElementById('div-tasks-done');
var $divTasksUndone = document.getElementById('div-tasks-undone');

function renderTasks(tasks){
  $divTasksDone.innerHTML = '';
  $divTasksUndone.innerHTML = '';

  for(var i = tasks.length-1; i >= 0; i--){
    var $newTask = document.createElement('div');
    $newTask.className = 'div-task';
    $newTask.setAttribute('id', tasks[i]._id);
    
    // add done/undone button
    var $doneButton = document.createElement('button');
    $doneButton.className = 'button-done';
    $doneButton.innerText = tasks[i].done ? 'Не сделано' : 'Сделано';
    $doneButton.addEventListener('click', tasks[i].done ? taskUndoneHandler : taskDoneHandler);
    $newTask.appendChild($doneButton);

    // add delete button
    var $deleteButton = document.createElement('button');
    $deleteButton.className = 'button-delete';
    $deleteButton.innerText = 'Удалить';
    $deleteButton.addEventListener('click', deleteTaskHandler);
    $newTask.appendChild($deleteButton);

    // add span - name
    var $nameSpan = document.createElement('span');
    $nameSpan.className = 'span-task-name';
    $nameSpan.innerText = tasks[i].name;
    $newTask.appendChild($nameSpan);

    // add span - created at
    var $createdSpan = document.createElement('span');
    $createdSpan.className = 'span-task-created';
    $createdSpan.innerText = `Создано: ${(new Date(tasks[i].createdAt)).toLocaleString()}`;
    $newTask.appendChild($createdSpan);

    // add span - updated at
    var $updatedSpan = document.createElement('span');
    $updatedSpan.className = 'span-task-updated';
    $updatedSpan.innerText = `Обновлено: ${(new Date(tasks[i].updatedAt)).toLocaleString()}`;
    $newTask.appendChild($updatedSpan);

    // append new task div to parent div
    var $parentDiv = tasks[i].done ? $divTasksDone : $divTasksUndone;
    $parentDiv.appendChild($newTask);
  }
}

function requestBackend(data){
  var url = 'http://localhost:3000/todo';
  var options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
  .then((tasks) => tasks.json())
  .then((tasks) => renderTasks(tasks));
}

function addNewTaskHandler(){
  var name = document.getElementById('text-task-name').value;
  if(name.length === 0){
    alert('Название задачи не может быть пустым');
    return;
  }
  requestBackend({action: 'newTask', name});
}

function deleteTaskHandler(event){
  var id = event.target.parentElement.getAttribute('id');
  requestBackend({action: 'deleteTask', id});
}

function taskDoneHandler(event){
  var id = event.target.parentElement.getAttribute('id');
  requestBackend({action: 'taskDone', id});
}

function taskUndoneHandler(event){
  var id = event.target.parentElement.getAttribute('id');
  requestBackend({action: 'taskUndone', id});
}