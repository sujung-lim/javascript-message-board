const addBtn = document.querySelector('.btn-add');

addBtn.addEventListener('click', () => {
  const newTaskInput = document.querySelector('.new-task-title');
  const newTaskInputText = newTaskInput.value;

  // <li>
  const todoUl = document.querySelector('#ul-todo-list');
  const todoLi = document.createElement('li');
  todoLi.id = 'li-todo-list';
  todoUl.appendChild(todoLi);

  // <input type="checkbox"> 체크박스
  const todoCheck = document.createElement('input');
  todoCheck.type = 'checkbox';
  todoCheck.classList.add('checkbox');
  todoLi.appendChild(todoCheck);

  // checkbox가 체크되면 Completed 리스트로 옮기기
  todoCheck.addEventListener('change', function () {
    const completedUl = document.querySelector('#ul-completed-list');
    if (this.checked) {
      completedUl.appendChild(todoLi);
    } else if (!this.checked) {
      todoUl.appendChild(todoLi);
    }
  });

  // <p> 리스트 제목
  const todoP = document.createElement('p');
  todoP.innerText = newTaskInputText;
  todoP.classList.add('todoTitle');
  todoLi.appendChild(todoP);

  // <button> 수정 버튼
  const editBtn = document.createElement('button');
  editBtn.innerHTML = 'Edit';
  todoLi.appendChild(editBtn);

  editBtn.addEventListener('click', () => {
    const todoTitle = todoLi.querySelector('.todoTitle');
    if (todoTitle.tagName.toLowerCase() === 'p') {
      const input = document.createElement('input');
      input.value = todoTitle.textContent;

      todoLi.replaceChild(input, todoTitle);
      input.focus();

      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const newTitle = input.value;
          const newP = document.createElement('p');
          newP.classList.add('todoTitle');
          newP.innerText = newTitle;
          todoLi.replaceChild(newP, input);
        }
      });
    }
  });

  // <button> 삭제 버튼
  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = 'Delete';
  todoLi.appendChild(deleteBtn);

  deleteBtn.addEventListener('click', () => {
    todoLi.remove();
  });

  // 입력창 비우기
  newTaskInput.value = '';
});
