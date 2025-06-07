const unitPrice = 35000;

    function updateQuantity(change) {
      const input = document.getElementById('quantity');
      let value = parseInt(input.value) || 1;
      value += change;
      if (value < 1) {
        alert("⚠️ Số lượng tối thiểu là 1");
        value = 1;
      }
      if (value > 100) {
        alert("⚠️ Số lượng tối đa là 100");
        value = 100;
      }
      input.value = value;
      updateTotalPrice();
    }

    function validateQuantity() {
      const input = document.getElementById('quantity');
      let raw = input.value.trim();
      let value = parseInt(raw.replace(/\D/g, '')) || 1;

      if (raw === '') {
        input.value = 1;
        updateTotalPrice();
        return;
      }

      if (value < 1) {
        alert('⚠️ Số lượng tối thiểu là 1');
        value = 1;
      }

      if (value > 100) {
        alert('⚠️ Số lượng tối đa là 100');
        value = 100;
      }

      input.value = value;
      updateTotalPrice();
    }

    function updateTotalPrice() {
      const quantity = parseInt(document.getElementById('quantity').value);
      const total = quantity * unitPrice;
      document.getElementById('total-price').innerText =
        `Tổng giá: ${total.toLocaleString('vi-VN')}đ`;
    }

    // Đảm bảo rằng script chỉ chạy sau khi toàn bộ trang HTML đã được tải xong.
document.addEventListener('DOMContentLoaded', function() {

    // 1. Lấy các phần tử HTML cần thiết
    const nav = document.getElementById('mainNavbar');
    const navLogo = document.getElementById('navbarLogo');
    const pageContentWrapper = document.querySelector('.page-content-wrapper');

    // 2. Lưu lại các giá trị ban đầu của thanh điều hướng và logo
    let initialNavPaddingTopBottom = 10;
    let initialNavPaddingLeftRight = 40;
    let initialLogoHeight = navLogo.offsetHeight; // Lấy chiều cao thực tế của logo

    // 3. Hàm điều chỉnh khoảng đệm cho nội dung chính
    // Mục đích: ngăn nội dung trang không bị thanh điều hướng che mất.
    function adjustPageContentPadding() {
        if (nav && pageContentWrapper) {
            pageContentWrapper.style.paddingTop = nav.offsetHeight + 'px';
        }
    }

    // Gọi hàm này ngay khi tải trang để đặt khoảng đệm ban đầu
    adjustPageContentPadding();
    // Và gọi lại mỗi khi cửa sổ trình duyệt thay đổi kích thước
    window.addEventListener('resize', adjustPageContentPadding);

    // 4. Lắng nghe sự kiện cuộn trang
    window.addEventListener('scroll', function() {
        // Nếu không tìm thấy thanh điều hướng hoặc logo thì dừng lại
        if (!nav || !navLogo) return;

        // Kiểm tra xem người dùng đã cuộn xuống hơn 50 pixels chưa
        if (window.scrollY > 50) {
            // TRẠNG THÁI KHI CUỘN XUỐNG
            nav.style.backgroundColor = 'rgba(255, 165, 0, 0.9)'; // Nền trong suốt hơn
            nav.style.padding = `5px ${initialNavPaddingLeftRight}px`; // Giảm đệm trên-dưới
            navLogo.style.height = (initialLogoHeight * 0.8) + 'px'; // Thu nhỏ logo 20%
        } 
        else {
            // TRẠNG THÁI KHI Ở TRÊN CÙNG
            nav.style.backgroundColor = 'orange'; // Trở về màu nền ban đầu
            nav.style.padding = `${initialNavPaddingTopBottom}px ${initialNavPaddingLeftRight}px`; // Trở về đệm ban đầu
            navLogo.style.height = initialLogoHeight + 'px'; // Trở về chiều cao logo ban đầu
        }
        
        // Cập nhật lại khoảng đệm cho nội dung sau mỗi lần thay đổi style
        adjustPageContentPadding(); 
    });

});