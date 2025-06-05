document.addEventListener('DOMContentLoaded', () => {
    const btnPrev = document.querySelector('.button.prev');
    const btnNext = document.querySelector('.button.next');
    const btnPage1 = document.querySelector('.Khuyen_mai_page1');
    const btnPage2 = document.querySelector('.Khuyen_mai_page2');
    const pagination = document.querySelector('.pagination');
    
    // 👉 Đã sửa dòng này để lấy phần tử footer của bạn
    const footer = document.querySelector('footer'); // Lấy thẻ footer HTML

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

    // 👉 Đã sửa xử lý hiển thị thanh phân trang
    function checkPaginationVisibility() {
        const scrollY = window.scrollY; // Vị trí cuộn hiện tại từ đỉnh trang
        const windowHeight = window.innerHeight; // Chiều cao cửa sổ trình duyệt
        const documentHeight = document.body.offsetHeight; // Tổng chiều cao của tài liệu

        let footerTop = documentHeight; // Mặc định là cuối trang nếu không tìm thấy footer

        // Chỉ tính toán footerTop nếu footer tồn tại
        if (footer) {
            // Lấy vị trí của footer so với đỉnh tài liệu
            footerTop = footer.getBoundingClientRect().top + scrollY;
        }

        // Điểm kích hoạt hiển thị phân trang (ví dụ: 100px trước footer)
        // Bạn có thể điều chỉnh giá trị 100px này.
        // Giá trị này nên nhỏ hơn chiều cao của footer một chút
        // để phân trang hiện ra đủ lâu trước khi footer che mất nó.
        const triggerPoint = footerTop - 100; 

        // Kiểm tra xem người dùng đã cuộn đến điểm kích hoạt chưa
        // HOẶC nếu trang không đủ dài để cuộn (ví dụ: nội dung ngắn hơn màn hình)
        if ((scrollY + windowHeight >= triggerPoint) || (documentHeight <= windowHeight)) {
            pagination.classList.add('visible');
        } else {
            pagination.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', checkPaginationVisibility);
    window.addEventListener('resize', checkPaginationVisibility);
    checkPaginationVisibility(); // Gọi lúc vừa load trang để kiểm tra trạng thái ban đầu
});