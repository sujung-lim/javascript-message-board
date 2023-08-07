const newMessageForm = document.querySelector('.new-message-form');

newMessageForm.addEventListener('submit', e => {
  e.preventDefault();
  /* submit 이벤트가 발생하면 폼이 기본적으로 페이지를 새로고침함
   * 그래서 Add 버튼을 누르면 리스트가 생겼다가 바로 사라짐
   * 이 문제를 방지하기 위해 preventDefault() 사용
   */
  // <table>
  const table = document.createElement('table');
  const tableHead = document.createElement('thead');
  table.appendChild(tableHead);

  const headerRow = document.createElement('tr');
  tableHead.appendChild(headerRow);

  const headers = ['작성자', '제목', '작성날짜', '조회수'];
  headers.forEach(header => {
    const headerCell = document.createElement('th');
    headerCell.innerText = header;
    headerRow.appendChild(headerCell);
  });

  // <tbody>
  const tableMessageList = document.createElement('tbody');
  tableMessageList.setAttribute('id', 'table-message-list');
  table.appendChild(tableMessageList);

  const newMessageWriter = document.querySelector('.new-message-writer').value;
  const newMessageTitle = document.querySelector('.new-message-title').value;
  const newMessageContent = document.querySelector(
    '.new-message-content'
  ).value;

  // <li>
  const messageUl = document.querySelector('#ul-message-list');
  const messageLi = document.createElement('li');
  messageLi.id = 'li-message-list';
  messageUl.appendChild(messageLi);

  // <p> 리스트 제목
  const messageTitle = document.createElement('p');
  messageTitle.innerText = newMessageTitle;
  messageTitle.classList.add('message-Title');
  messageLi.appendChild(messageTitle);

  // 리스트 제목 클릭하면 상세 내용 보여주기
  let contentAdded = false;

  messageTitle.addEventListener('click', () => {
    if (!contentAdded) {
      contentAdded = true;
      showMessageContent();
    } else {
      contentAdded = false;
      hideMessageContent();
    }
  });

  // 상세 내용 보여주기 함수
  function showMessageContent() {
    const messageContent = document.createElement('p');
    messageContent.innerText = newMessageContent;
    messageContent.classList.add('message-content');
    messageUl.appendChild(messageContent);
  }

  // 상세 내용 숨기기 함수
  function hideMessageContent() {
    const messageContent = document.querySelector('.message-content');
    if (messageContent) {
      messageContent.remove();
    }
  }

  // // <button> 수정 버튼
  // const editBtn = document.createElement('button');
  // editBtn.innerHTML = 'Edit';
  // editBtn.classList.add('edit-btn');
  // messageLi.appendChild(editBtn);

  // editBtn.addEventListener('click', () => {
  //   const messageTitle = messageLi.querySelector('.messageTitle');
  //   if (messageTitle.tagName.toLowerCase() === 'p') {
  //     const input = document.createElement('input');
  //     input.value = messageTitle.textContent;

  //     messageLi.replaceChild(input, messageTitle);
  //     input.focus();

  //     input.addEventListener('keydown', e => {
  //       if (e.key === 'Enter') {
  //         const newTitle = input.value;
  //         const newP = document.createElement('p');
  //         newP.classList.add('messageTitle');
  //         newP.innerText = newTitle;
  //         messageLi.replaceChild(newP, input);
  //       }
  //     });
  //   }
  // });

  // // <button> 삭제 버튼
  // const deleteBtn = document.createElement('button');
  // deleteBtn.innerHTML = 'Delete';
  // deleteBtn.classList.add('delete-btn');
  // messageLi.appendChild(deleteBtn);

  // deleteBtn.addEventListener('click', () => {
  //   const messageContent = document.querySelector('.message-content');
  //   messageLi.remove();
  //   if (messageContent) {
  //     messageContent.remove();
  //   }
  // });

  // 입력창 비우기
  newMessageTitle.value = '';
});
