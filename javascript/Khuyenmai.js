document.addEventListener('DOMContentLoaded', () => {
  const btnPrev = document.querySelector('.button.prev');
  const btnNext = document.querySelector('.button.next');
  const btnPage1 = document.querySelector('.Khuyen_mai_page1');
  const btnPage2 = document.querySelector('.Khuyen_mai_page2');
  const pagination = document.querySelector('.pagination');

  // Hàm lấy tên file hiện tại
  function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1);
    return file;
  }

  const currentPage = getCurrentPage();

  // Chuyển trang
  function goToPage(page) {
    if (page === 'page1') {
      window.location.href = 'Khuyen_mai_page1.html';
    } else if (page === 'page2') {
      window.location.href = 'Khuyen_mai_page2.html';
    }
  }

  // Xử lý nút prev
  btnPrev.addEventListener('click', () => {
    if (currentPage === 'Khuyen_mai_page2.html') {
      goToPage('page1');
    }
  });

  // Xử lý nút next
  btnNext.addEventListener('click', () => {
    if (currentPage === 'Khuyen_mai_page1.html') {
      goToPage('page2');
    }
  });

  // Xử lý nút số 1
  btnPage1.addEventListener('click', () => {
    if (currentPage !== 'Khuyen_mai_page1.html') {
      goToPage('page1');
    }
  });

  // Xử lý nút số 2
  btnPage2.addEventListener('click', () => {
    if (currentPage !== 'Khuyen_mai_page2.html') {
      goToPage('page2');
    }
  });

  // 👉 Thêm xử lý hiển thị thanh phân trang khi cuộn đến gần cuối
  function checkPaginationVisibility() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const pageHeight = document.body.offsetHeight;

    // Hiện phân trang khi gần cuối trang hoặc nếu trang không thể cuộn
    if (scrollY + windowHeight >= pageHeight - 200 || windowHeight >= pageHeight) {
      pagination.classList.add('visible');
    } else {
      pagination.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', checkPaginationVisibility);
  window.addEventListener('resize', checkPaginationVisibility);
  checkPaginationVisibility(); // Gọi lúc vừa load trang
});