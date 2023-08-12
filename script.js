'use strict';

const openModal = document.querySelector('.open-qa-modal');
const modal = document.querySelector('.modal-overlay');

const body = document.body;
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
  const qaContent = document.querySelector('#qa-content');
  qaTitle.value = '';
  qaContent.value = '';
  if (flag == 'open') modal.style.display = 'block';
  else modal.style.display = 'none';
}

// 상품 Q&A 작성 내용 저장
const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', e => {
  e.preventDefault();
  // 제목, 내용 값 저장
  const qaTitle = document.querySelector('input.qa-title').value;
  const qaContent = document.querySelector('#qa-content').value;

  // 게시판 리스트 생성
  const tr = document.createElement('tr');
  const tbody = document.querySelector('.table-body');
  tbody.appendChild(tr);

  // 상태 td 생성
  const tdStatus = document.createElement('td');
  tdStatus.innerText = '답변 대기';
  tr.appendChild(tdStatus);

  // 제목에 대한 td 생성
  const tdTitle = document.createElement('td');
  tdTitle.innerText = qaTitle;
  tr.appendChild(tdTitle);

  // 작성자에 대한 td 생성
  const tdWriter = document.createElement('td');
  tdWriter.innerText = '익명'; // 실제 작성자 정보로 바꾸어야 함
  tr.appendChild(tdWriter);

  // 작성일에 대한 td 생성
  const tdDate = document.createElement('td');
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  tdDate.innerText = formattedDate;
  tr.appendChild(tdDate);
  modalOpen('close');
});
