'use strict';

const openModal = document.querySelector('.open-qa-modal');
const modal = document.querySelector('.modal-overlay');

const body = document.body;

// 모달창 열고 닫기
openModal.addEventListener('click', e => {
  e.preventDefault();
  modalOpen('open');
});

const closeModal = document.querySelector('.close-modal-btn');
closeModal.addEventListener('click', () => {
  modalOpen('close');
});

function modalOpen(flag) {
  const qaTitle = document.querySelector('input.qa-title');
  const qaWriter = document.querySelector('.qa-writer');
  const qaContent = document.querySelector('#qa-content');
  qaTitle.value = '';
  qaWriter.value = '';
  qaContent.value = '';
  if (flag == 'open') modal.style.display = 'block';
  else modal.style.display = 'none';
}

// 내용 입력 후 등록 버튼 누르면 값 저장
const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', e => {
  e.preventDefault();
  // 제목, 작성자, 내용 값 저장
  const qaTitle = document.querySelector('.qa-title').value;
  const qaWriter = document.querySelector('.qa-writer').value;
  const qaContent = document.querySelector('#qa-content').value;

  saveData();
  addContentTable(qaTitle, qaWriter, qaContent);
  modalOpen('close');
});

function addContentTable(qaTitle, qaWriter, qaContent) {
  // 게시판 리스트 생성
  const tr = document.createElement('tr');
  const tbody = document.querySelector('.table-body');
  const firstChild = tbody.childNodes[0];
  tbody.insertBefore(tr, firstChild);

  // 상태 td 생성
  const tdStatus = document.createElement('td');
  tdStatus.innerText = '답변 대기';
  tr.appendChild(tdStatus);

  // 제목에 대한 td 생성
  const tdTitle = document.createElement('td');
  tdTitle.innerText = qaTitle;
  tr.appendChild(tdTitle);

  // 토글 변수 추가하여 상태 관리
  let isContentVisible = false;
  let contentTr = null;

  // 제목 클릭시 문의 내용 보여주기
  tdTitle.addEventListener('click', () => {
    if (!isContentVisible) {
      // 내용이 보이지 않을 때는 내용을 보여줌
      contentTr = document.createElement('tr');
      tr.insertAdjacentElement('afterend', contentTr);
      contentTr.classList.add('qa-content-tr');

      const newTdStatus = document.createElement('td');
      contentTr.appendChild(newTdStatus);

      const newTdTitle = document.createElement('td');
      newTdTitle.innerText = qaContent;
      contentTr.appendChild(newTdTitle);

      const newTdWriter = document.createElement('td');
      contentTr.appendChild(newTdWriter);

      const newTdDate = document.createElement('td');
      contentTr.appendChild(newTdDate);

      // 상태 업데이트
      isContentVisible = true;
    } else {
      // 이미 내용이 보일 때는 숨김
      contentTr.remove();
      contentTr = null;

      //상태 업데이트
      isContentVisible = false;
    }
  });

  // 작성자에 대한 td 생성
  const tdWriter = document.createElement('td');
  tdWriter.innerText = qaWriter;
  tr.appendChild(tdWriter);

  // 작성일에 대한 td 생성
  const tdDate = document.createElement('td');
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  tdDate.innerText = formattedDate;
  tr.appendChild(tdDate);
}

// 입력한 내용 저장
function saveData() {
  let oldData = localStorage.getItem('object');
  let obj = JSON.parse(oldData);

  if (!obj) {
    obj = [];
  }

  const qaTitle = document.querySelector('.qa-title').value;
  const qaWriter = document.querySelector('.qa-writer').value;
  const qaContent = document.querySelector('#qa-content').value;

  const newObj = { title: qaTitle, writer: qaWriter, content: qaContent };
  obj.push(newObj);
  localStorage.setItem('object', JSON.stringify(obj));
}

// 저장한 내용 브라우저에 유지하기
window.addEventListener('load', () => {
  const storedData = JSON.parse(localStorage.getItem('object'));

  if (storedData) {
    storedData.forEach(data => {
      addContentTable(data.title, data.writer, data.content);
    });
  }
});
