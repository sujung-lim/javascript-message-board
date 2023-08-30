'use strict';

const openModal = document.querySelector('.open-qa-modal');
const modalOverlay = document.querySelector('.modal-overlay');

const body = document.body;

// **상품 Q&A 작성** 모달창
openModal.addEventListener('click', e => {
  e.preventDefault();
  modalOpen('open');
});

function modalOpen(flag) {
  const qaTitle = document.querySelector('input.qa-title');
  const qaWriter = document.querySelector('.qa-writer');
  const qaContent = document.querySelector('#qa-content');
  qaTitle.value = '';
  qaWriter.value = '';
  qaContent.value = '';
  if (flag == 'open') {
    modalOverlay.style.display = 'block';
    // 배경 클릭 이벤트 리스너
    modalOverlay.addEventListener('click', closeModal);
  } else {
    modalOverlay.style.display = 'none';
    // 배경 클릭 이벤트 리스너 제거
    modalOverlay.removeEventListener('click', closeModal);
  }
}

// **상품 Q&A 작성** 내용 입력 후 등록 버튼 누르면 값 저장
const submitBtn = document.querySelector('.submit-btn');

// **상품 Q&A 작성** 문의 내용 저장
submitBtn.addEventListener('click', e => {
  // 제목, 작성자, 내용 값 저장
  const qaTitleElement = document.querySelector('.qa-title');
  const qaWriterElement = document.querySelector('.qa-writer');
  const qaContentElement = document.querySelector('#qa-content');

  const qaTitle = qaTitleElement.value;
  const qaWriter = qaWriterElement.value;
  const qaContent = qaContentElement.value;

  // 제목, 작성자, 내용 값 유효성 검사
  let isValid = true;

  if (!qaTitle) {
    qaTitleElement.classList.add('input-invalid');
    isValid = false;
  } else {
    qaTitleElement.classList.remove('input-invalid');
  }

  if (!qaWriter) {
    qaWriterElement.classList.add('input-invalid');
    isValid = false;
  } else {
    qaWriterElement.classList.remove('input-invalid');
  }

  if (!qaContent) {
    qaContentElement.classList.add('input-invalid');
    isValid = false;
  } else {
    qaContentElement.classList.remove('input-invalid');
  }

  if (!isValid) {
    e.preventDefault();
    return;
  }

  saveData();
  let idx = getMaxIdx();
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  addContentTable(idx, qaTitle, qaWriter, qaContent, formattedDate);
  modalOpen('close');
});

const closeModalBtn = document.querySelector('.close-modal-btn');
closeModalBtn.addEventListener('click', () => {
  modalOpen('close');
});

function closeModal(e) {
  if (e.target === modalOverlay) {
    modalOpen('close');

    // 초기 상태로 돌리기 위해 input-invalid 클래스 제거
    document.querySelector('.qa-title').classList.remove('input-invalid');
    document.querySelector('.qa-writer').classList.remove('input-invalid');
    document.querySelector('#qa-content').classList.remove('input-invalid');
  }
}

// **나의 Q&A 조회** 모달창 열기
const openSearchModal = document.querySelector('.open-search-modal');
const searchModalOverlay = document.querySelector('.search-modal-overlay');
const searchModal = document.querySelector('.search-modal');

openSearchModal.addEventListener('click', e => {
  e.preventDefault();
  searchModalOpen('open');
});

function searchModalOpen(flag) {
  if (flag === 'open') {
    searchModalOverlay.style.display = 'flex';
    searchModal.style.display = 'block';
    //배경 클릭 이벤트 리스너
    searchModalOverlay.addEventListener('click', closeSearchModal);
  } else {
    searchModalOverlay.style.display = 'none';
    searchModal.style.display = 'none';
    //배경 클릭 이벤트 리스너 제거
    searchModalOverlay.removeEventListener('click', closeSearchModal);
  }
}

// **나의 Q&A 조회** 모달창 닫기
function closeSearchModal(e) {
  if (e.target === searchModalOverlay) {
    searchModalOpen('close');
  }
}

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

var comment = {
  addCommentList: function () {},
  deletecomment: function () {},
  addcomment: function () {},
  id: 20,
};

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

          // 답변 삭제 버튼
          const deleteButton = document.createElement('button');
          deleteButton.innerText = 'x';
          commentP.appendChild(deleteButton);

          deleteButton.addEventListener('click', () => {
            const commentIndex = o.commentList.indexOf(c);

            // commentList에서 comment 삭제하기
            if (commentIndex > -1) {
              o.commentList.splice(commentIndex, 1);
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

// 상품 Q&A 작성하면 테이블 생성
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
  tdStatus.innerText = '답변대기';
  tr.appendChild(tdStatus);
  tdStatus.classList.add('qa-td-status');

  // 제목에 대한 td 생성
  const tdTitle = document.createElement('td');
  tdTitle.innerText = qaTitle;
  tdTitle.classList.add('qa-td-title');
  tr.appendChild(tdTitle);

  // 답변 달기 버튼
  const commentBtn = document.createElement('button');
  commentBtn.innerText = '답변 달기';
  commentBtn.classList.add('comment-btn');

  // 답변 입력창
  const commentInput = document.createElement('textarea');
  commentInput.placeholder = '답변을 입력하세요';

  let RefnewTdTitle;
  function commentHandler() {
    if (!isCommentOn) {
      RefnewTdTitle.appendChild(commentInput);
      commentBtn.innerText = '답변 달기 취소';
      isCommentOn = true;

      //Enter 키 누르면 답변 저장
      commentInput.addEventListener('keypress', keyFunction);
    } else {
      commentInput.removeEventListener('keypress', keyFunction);
      commentBtn.innerText = '답변 달기';
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

      const newTdContent = document.createElement('td');
      newTdContent.innerText = qaContent;
      newTdContent.classList.add('qa-content');
      contentTr.appendChild(newTdContent);

      const newTdWriter = document.createElement('td');
      contentTr.appendChild(newTdWriter);

      const newTdDate = document.createElement('td');
      contentTr.appendChild(newTdDate);

      // 답변리스트
      addCommentList(idx, newTdContent);

      // 답변 달기 버튼 보여주기
      newTdContent.appendChild(commentBtn);
      RefnewTdTitle = newTdContent;
      commentBtn.removeEventListener('click', commentHandler);
      // 답변 달기 누르면 답변 입력창 보여주기
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

// 답변 내용 로컬스토리지에 저장
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

function saveComment(newTdContent, commentInput, commentBtn, idx) {
  const comment = commentInput.value;

  if (comment) {
    // 문의 내용(newTdContent) 아래에 답변 내용 추가
    const commentP = document.createElement('p');
    const replyIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>`;
    commentP.innerHTML = replyIcon + comment;
    commentP.classList.add('comment-text');

    // textarea 앞에 답변(p 태그) 추가
    newTdContent.insertBefore(commentP, commentInput);

    // 답변 삭제
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'x';
    deleteButton.setAttribute('id-path', idx);
    commentP.appendChild(deleteButton);

    deleteButton.addEventListener('click', e => {
      // 로컬 스토리지에서 답변 인덱스 찾기
      let idx = e.target.getAttribute('id-path');
      deleteComment(idx, comment);

      // DOM에서 답변 삭제
      commentP.remove();

      updateStatus();
    });

    // savedComments.push(commentP); //답변 저장
    saveCommentToLocalstorage(idx, comment);
    // commentInput.remove();
    commentBtn.remove();
  }

  // 답변 입력창 비우기
  commentInput.value = '';

  updateStatus();
}

// function deleteComment(idx, comment) {
//   let obj = getObj();

//   obj.forEach(o => {
//     if (o.idx == idx) {
//       if (o.commentList) {
//         o.commentList.forEach(c => {
//           const commentIndex = o.commentList.indexOf(c);

//           if (commentIndex > -1) {
//             o.commentList.splice(commentIndex, 1);
//             localStorage.setItem('object', JSON.stringify(obj));
//           }
//         });
//       }
//     }
//   });
// }

function deleteComment(idx, comment) {
  let obj = getObj();

  obj.forEach(o => {
    if (o.idx == idx) {
      if (o.commentList) {
        const commentIndex = o.commentList.indexOf(comment);

        if (commentIndex > -1) {
          o.commentList.splice(commentIndex, 1);
          localStorage.setItem('object', JSON.stringify(obj));
        }
      }
    }
  });
}

function getObj() {
  let oldData = localStorage.getItem('object');
  let obj = JSON.parse(oldData);
  return obj;
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

// 답변 상태 업데이트
function updateStatus() {
  const tdStatuses = document.querySelectorAll('.qa-td-status');

  // const currentTr = document.querySelectorAll('.qa-content-tr');

  const statusStorage = {};

  tdStatuses.forEach(tdStatus => {
    const currentTr = tdStatus.closest('tr');
    const statusId = currentTr.getAttribute('data-status-id');

    const contentTr = currentTr.nextElementSibling;

    if (contentTr) {
      const commentText = contentTr.querySelector('.comment-text');
      contentTr.setAttribute('data-status-id', statusId);
      console.log(contentTr);

      // comment-text가 있다면
      if (commentText) {
        tdStatus.innerText = '답변완료';
        statusStorage[statusId] = '답변완료';
      } else {
        tdStatus.innerText = '미답변';
        statusStorage[statusId] = '미답변';
      }
    } else {
      tdStatus.innerText = '미답변';
      statusStorage[statusId] = '미답변';
    }
  });
  localStorage.setItem('statusStorage', JSON.stringify(statusStorage));
}

// 답변 상태 불러오기
document.addEventListener('DOMContentLoaded', () => {
  const savedStatusStorage = localStorage.getItem('statusStorage');

  if (savedStatusStorage) {
    const parsedStatusStorage = JSON.parse(savedStatusStorage);

    const tdStatuses = document.querySelectorAll('.qa-td-status');

    tdStatuses.forEach(tdStatus => {
      const currentTr = tdStatus.closest('tr');
      const statusId = currentTr.getAttribute('data-status-id');

      const savedStatus = parsedStatusStorage[statusId];

      if (savedStatus) {
        tdStatus.innerText = savedStatus;
      }
    });
  }
});

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
