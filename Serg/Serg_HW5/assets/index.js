/* eslint-disable no-invalid-this */
function init() {
  const todoList = document.getElementById('todoList');
  const todoForm = document.getElementById('todoForm');
  const submitButton = document.getElementById('submitButton');

  submitButton.addEventListener('click', addToDo);

  fetch('/todos', {
    method: 'GET',
  }).
      then(status).
      then((response) => response.json()).
      then((data) => {
        if (data.length === 0) {
          let li = document.createElement('li');

          li.innerText = 'Задач нет';

          todoList.appendChild(li);
        } else {
          data.map((item) => {
            const {_id: id, status, name} = item;
            const li = document.createElement('li');

            li.id = id;
            li.innerText = name;
            if (status) li.className = 'complete';
            li.addEventListener('click', toDoComplete);

            todoList.appendChild(li);
          });
        }
      }).catch((error) => {
        alert('Запрос неудачен', error);
      });

  function toDoComplete() {
    let id = this.id;
    let todoStatus = !this.classList.contains('complete');

    fetch('/todos', {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, todoStatus}),
    }).
        then(status).
        then((response) => response.json()).
        then((data) => {
          this.classList.toggle('complete');
        }).catch((error) => {
          alert('Запрос неудачен', error);
        });
  }

  function addToDo(e) {
    e.preventDefault();
    this.disabled = true;

    let value = document.getElementById('todo').value.trim();

    if (!value) {
      alert('Введите задачу');
      this.disabled = false;
      return;
    }
    
    fetch('/todos', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({value}),
    }).
        then(status).
        then((response) => response.json()).
        then((data) => {
          const {_id: id, status, name} = data;
          const li = document.createElement('li');

          li.id = id;
          li.innerText = name;
          if (status) li.className = 'complete';
          li.addEventListener('click', toDoComplete);

          todoList.appendChild(li);

          this.disabled = false;
          todoForm.reset();
        }).catch((error) => {
          alert('Запрос неудачен', error);
        });
  }

  function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
