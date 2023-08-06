const newTaskForm = document.querySelector('.new-task-form');

newTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  /* submit 이벤트가 발생하면 폼이 기본적으로 페이지를 새로고침함
   * 그래서 Add 버튼을 누르면 리스트가 생겼다가 바로 사라짐
   * 이 문제를 방지하기 위해 preventDefault() 사용
   */

  const newTaskTitle = document.querySelector('.new-task-title').value;
  const newTaskContent = document.querySelector('.new-task-content').value;

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
  const todoTitle = document.createElement('p');
  todoTitle.innerText = newTaskTitle;
  todoTitle.classList.add('todo-Title');
  todoLi.appendChild(todoTitle);

  // 리스트 제목 클릭하면 상세 내용 보여주기
  let contentAdded = false;

  /*******여기 해야함 */
  todoTitle.addEventListener('click', () => {
    if (!contentAdded) {
      contentAdded = true;
      showTodoContent();
    }
  });

  // 상세 내용 보여주기 함수
  function showTodoContent() {
    const todoContent = document.createElement('p');
    todoContent.innerText = newTaskContent;
    todoContent.classList.add('todo-content');
    todoUl.appendChild(todoContent);
  }
  // <button> 수정 버튼
  const editBtn = document.createElement('button');
  editBtn.innerHTML = 'Edit';
  editBtn.classList.add('edit-btn');
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
  deleteBtn.classList.add('delete-btn');
  todoLi.appendChild(deleteBtn);

  deleteBtn.addEventListener('click', () => {
    todoLi.remove();
  });

  // 입력창 비우기
  newTaskTitle.value = '';
});
