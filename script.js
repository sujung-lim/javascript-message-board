'use strict';

const openModal = document.querySelector('.open-qa-modal');
const modal = document.querySelector('.modal-overlay');

const body = document.body;

// let commentFlag = false;

//{title:"",cont:"", writer:"",status:"",regdate:"",reply:[]}
//const savedContents = [];

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

// 문의 내용 저장
submitBtn.addEventListener('click', e => {
  e.preventDefault();
  // 제목, 작성자, 내용 값 저장
  const qaTitle = document.querySelector('.qa-title').value;
  const qaWriter = document.querySelector('.qa-writer').value;
  const qaContent = document.querySelector('#qa-content').value;

  saveData();
  let idx = getMaxIdx();
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  addContentTable(idx, qaTitle, qaWriter, qaContent, formattedDate);
  modalOpen('close');
});

function getMaxIdx() {
  let oldData = localStorage.getItem('object');
  let obj = JSON.parse(oldData);

  if (!obj) {
    return 1;
  }

  let maxidx = 0;
  obj.forEach(o => {
    if (o.idx > maxidx) maxidx = o.idx;
  });
  maxidx++;
  return maxidx;
}

function addCommentList(idx, td) {
  // let oldData = localStorage.getItem('object');
  // let obj = JSON.parse(oldData);
  let obj = JSON.parse(localStorage.getItem('object'));

  obj.forEach(o => {
    if (o.idx == idx) {
      if (o.commentList) {
        o.commentList.forEach(c => {
          const commentP = document.createElement('p');
          const replyIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>`;
          commentP.innerHTML = replyIcon + c;
          commentP.classList.add('comment-text');
          td.appendChild(commentP);

          // 댓글 삭제 버튼
          const deleteButton = document.createElement('button');
          deleteButton.innerText = 'x';
          commentP.appendChild(deleteButton);

          deleteButton.addEventListener('click', () => {
            const commentIndex = o.commentList.indexOf(c);

            // commentList에서 comment 삭제하기
            if (commentIndex > -1) {
              // o.commentList.splice(commentIndex, 1);
            }

            // 수정된 객체 로컬스토리지 업데이트
            localStorage.setItem('object', JSON.stringify(obj));

            // DOM에서 comment 지우기
            commentP.remove();
          });
        });
      }
    }
  });
}

// Q&A 작성하면 테이블 생성
function addContentTable(idx, qaTitle, qaWriter, qaContent, qaDate) {
  const qaData = {};

  // 토글 변수 추가하여 상태 관리
  let isContentVisible = false;
  let contentTr = null;
  let isCommentOn = false;

  // 게시판 리스트 생성
  const tr = document.createElement('tr');
  tr.setAttribute('idx', idx);
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
  tdTitle.classList.add('qa-td-title');
  tr.appendChild(tdTitle);

  // 댓글 달기 버튼
  const commentBtn = document.createElement('button');
  commentBtn.innerText = '댓글 달기';
  commentBtn.classList.add('comment-btn');

  // 댓글 입력창
  const commentInput = document.createElement('textarea');
  commentInput.placeholder = '댓글을 입력하세요';

  let RefnewTdTitle;
  function commentHandler() {
    if (!isCommentOn) {
      RefnewTdTitle.appendChild(commentInput);
      commentBtn.innerText = '댓글 달기 취소';
      isCommentOn = true;

      //Enter 키 누르면 댓글 저장
      commentInput.addEventListener('keypress', keyFunction);
    } else {
      commentInput.removeEventListener('keypress', keyFunction);
      commentBtn.innerText = '댓글 달기';
      commentInput.remove();
      isCommentOn = false;
    }
  }
  function keyFunction(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      saveComment(RefnewTdTitle, commentInput, commentBtn, idx);
      return false;
    }
  }

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

      //댓글리스트
      addCommentList(idx, newTdTitle);

      // 댓글 달기 버튼 보여주기
      newTdTitle.appendChild(commentBtn);
      RefnewTdTitle = newTdTitle;
      commentBtn.removeEventListener('click', commentHandler);
      // 댓글 달기 누르면 댓글 입력창 보여주기
      commentBtn.addEventListener('click', commentHandler);

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

  // const currentDate = new Date();
  // const formattedDate = currentDate.toISOString().split('T')[0];
  tdDate.innerText = qaDate;
  tr.appendChild(tdDate);
}

function saveCommentToLocalstorage(idx, comment) {
  let oldData = localStorage.getItem('object');
  let obj = JSON.parse(oldData);

  obj.forEach(o => {
    if (o.idx == idx) {
      if (o.commentList && o.commentList.length >= 1) {
        o.commentList.push(comment);
      } else {
        o.commentList = [comment];
      }
    }
  });

  localStorage.setItem('object', JSON.stringify(obj));
}

function saveComment(newTdTitle, commentInput, commentBtn, idx) {
  const comment = commentInput.value;

  if (comment) {
    // 문의 내용(newTdTitle) 아래에 댓글 내용 추가
    const commentP = document.createElement('p');
    const replyIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>`;
    commentP.innerHTML = replyIcon + comment;
    commentP.classList.add('comment-text');

    // textarea 앞에 댓글(p 태그) 추가
    newTdTitle.insertBefore(commentP, commentInput);

    // 댓글 삭제
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'x';
    commentP.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
      // 로컬 스토리지에서 댓글 인덱스 찾기
      const commentIndex = obj[idx].commentList.indexOf(comment);

      // 로컬 스토리지에서 댓글 삭제
      if (commentIndex > -1) {
        obj[idx].commentList.splice(commentIndex, 1);
        localStorage.setItem('object', JSON.stringify(obj));
      }

      // DOM에서 댓글 삭제
      commentP.remove();
    });

    // savedComments.push(commentP); //댓글 저장
    saveCommentToLocalstorage(idx, comment);
    // commentInput.remove();
    commentBtn.remove();
  }

  // 댓글 입력창 비우기
  commentInput.value = '';
}

// 입력한 내용 저장
function saveData() {
  let oldData = localStorage.getItem('object');
  let obj = JSON.parse(oldData);

  if (!obj) {
    obj = [];
  }

  let maxidx = 0;
  obj.forEach(o => {
    if (o.idx > maxidx) maxidx = o.idx;
  });
  maxidx++;

  const qaTitle = document.querySelector('.qa-title').value;
  const qaWriter = document.querySelector('.qa-writer').value;
  const qaContent = document.querySelector('#qa-content').value;

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];

  const newObj = {
    idx: maxidx,
    title: qaTitle,
    writer: qaWriter,
    content: qaContent,
    regdate: formattedDate,
  };
  obj.push(newObj);
  localStorage.setItem('object', JSON.stringify(obj));
}

// 저장한 내용 브라우저에 유지하기
window.addEventListener('load', () => {
  const storedData = JSON.parse(localStorage.getItem('object'));

  if (storedData) {
    storedData.forEach(data => {
      addContentTable(
        data.idx,
        data.title,
        data.writer,
        data.content,
        data.regdate
      );
    });
  }
});
