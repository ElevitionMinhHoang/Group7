// Contents of script.js

let cart = []; // Mảng để lưu trữ các sản phẩm trong giỏ hàng

/**
 * Định dạng số thành tiền tệ Việt Nam.
 * @param {number} amount - Số tiền cần định dạng.
 * @returns {string} - Chuỗi tiền tệ đã định dạng.
 */
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
}

/**
 * Thêm một sản phẩm vào giỏ hàng hoặc cập nhật số lượng nếu đã tồn tại.
 * @param {string} id - ID duy nhất của sản phẩm.
 * @param {string} name - Tên sản phẩm.
 * @param {number} price - Giá sản phẩm.
 * @param {number} [quantity=1] - Số lượng cần thêm.
 */
function addItemToCart(id, name, price, quantity = 1) {
    const existingItemIndex = cart.findIndex(item => item.id === id);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ id, name, price, quantity });
    }
}

/**
 * Hiển thị các sản phẩm trong giỏ hàng và tổng tiền ra HTML.
 */
function renderCartSummary() {
    const cartItemsListElement = document.getElementById('cart-items-list');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartGrandTotalElement = document.getElementById('cart-grand-total');

    if (!cartItemsListElement || !cartSubtotalElement || !cartGrandTotalElement) {
        console.error("Một hoặc nhiều phần tử HTML của giỏ hàng không tìm thấy để render!");
        return;
    }

    cartItemsListElement.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        const listItem = document.createElement('li');
        listItem.textContent = 'Chưa có sản phẩm nào trong giỏ hàng.';
        listItem.style.textAlign = 'center';
        listItem.style.color = '#777';
        cartItemsListElement.appendChild(listItem);
    } else {
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="item-name">${item.name} (x${item.quantity})</span>
                <span class="item-price">${formatCurrency(item.price * item.quantity)}</span>
            `;
            cartItemsListElement.appendChild(listItem);
            subtotal += item.price * item.quantity;
        });
    }

    cartSubtotalElement.textContent = formatCurrency(subtotal);
    const grandTotal = subtotal; // Giả sử miễn phí vận chuyển
    cartGrandTotalElement.textContent = formatCurrency(grandTotal);
}

/**
 * Thêm các sản phẩm khởi tạo vào giỏ hàng và hiển thị chúng.
 */
function addInitialItemsToCart() {
    addItemToCart("combo-cong-chua", "Combo Công chúa", 120000, 1);
    addItemToCart("tra-quat", "Trà quất", 20000, 1);
    renderCartSummary(); // Cập nhật giao diện giỏ hàng
}

// --- Chạy mã chính khi DOM đã sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Thêm các sản phẩm ban đầu vào giỏ hàng và hiển thị
    addInitialItemsToCart();

    // 2. Thiết lập logic cho nút "Xác Nhận Đặt Hàng"
    const placeOrderButton = document.getElementById('place-order-btn');
    const successAlertElement = document.getElementById('custom-success-alert');

    if (!successAlertElement) {
        console.error("Phần tử #custom-success-alert không tìm thấy trong HTML!");
    }

    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', () => {
            const customerNameInput = document.getElementById('name');
            const customerPhoneInput = document.getElementById('phone');
            const customerAddressInput = document.getElementById('address');

            const customerName = customerNameInput.value.trim();
            const customerPhone = customerPhoneInput.value.trim();
            const customerAddress = customerAddressInput.value.trim();

            // Kiểm tra giỏ hàng có trống không
            if (cart.length === 0) {
                alert("Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng!");
                return;
            }

            // Kiểm tra các trường thông tin bắt buộc
            let allFieldsValid = true;
            if (!customerName) {
                if (customerNameInput) customerNameInput.style.borderColor = 'red';
                allFieldsValid = false;
            } else {
                if (customerNameInput) customerNameInput.style.borderColor = '#ddd';
            }

            if (!customerPhone) {
                if (customerPhoneInput) customerPhoneInput.style.borderColor = 'red';
                allFieldsValid = false;
            } else {
                if (customerPhoneInput) customerPhoneInput.style.borderColor = '#ddd';
            }

            if (!customerAddress) {
                if (customerAddressInput) customerAddressInput.style.borderColor = 'red';
                allFieldsValid = false;
            } else {
                if (customerAddressInput) customerAddressInput.style.borderColor = '#ddd';
            }

            if (!allFieldsValid) {
                alert("Bạn hãy nhập đủ thông tin");
                return;
            }

            // Kiểm tra định dạng số điện thoại đơn giản
            if (!/^(0\d{9})$/.test(customerPhone)) {
                alert("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại (phải là 10 số, bắt đầu bằng 0).");
                if (customerPhoneInput) customerPhoneInput.style.borderColor = 'red';
                return;
            } else {
                if (customerPhoneInput) customerPhoneInput.style.borderColor = '#ddd';
            }

            // Nếu tất cả kiểm tra đều qua
            if (successAlertElement) {
                successAlertElement.classList.add('visible');
            } else {
                // Fallback nếu không tìm thấy #custom-success-alert
                alert("Đơn hàng của bạn đã được ghi nhận (lỗi hiển thị thông báo tùy chỉnh)");
            }

            // Chuyển trang sau một khoảng thời gian ngắn
            setTimeout(() => {
                if (successAlertElement) {
                     successAlertElement.classList.remove('visible'); // Ẩn thông báo trước khi chuyển trang
                }
                window.location.href = "../Thuc_Don/ThucDon.html";
            }, 2500); // Đợi 2.5 giây
        });
    }

    // Reset màu viền nếu người dùng bắt đầu nhập lại
    const inputsToWatch = [
        document.getElementById('name'),
        document.getElementById('phone'),
        document.getElementById('address')
    ];
    inputsToWatch.forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '' && input.style.borderColor === 'red') {
                    input.style.borderColor = '#ddd';
                }
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
        const nav = document.getElementById('mainNavbar');
        const navLogo = document.getElementById('navbarLogo');
        const pageContentWrapper = document.querySelector('.page-content-wrapper');
        const heroCarouselElement = document.getElementById('heroCarousel');

        let initialNavPaddingTopBottom = 10;
        let initialNavPaddingLeftRight = 40;
        let initialLogoHeight = 50;

        if (navLogo) initialLogoHeight = navLogo.offsetHeight || 50;
        if (nav) {
            const computedStyle = window.getComputedStyle(nav);
            const paddingValues = computedStyle.padding.split(" ");
            if (paddingValues.length === 1) initialNavPaddingTopBottom = parseFloat(paddingValues[0]);
            if (paddingValues.length >= 2) {
                initialNavPaddingTopBottom = parseFloat(paddingValues[0]);
                initialNavPaddingLeftRight = parseFloat(paddingValues[1]);
            }
        }

        function adjustPageContentPadding() {
            if (nav && pageContentWrapper) {
                pageContentWrapper.style.paddingTop = nav.offsetHeight + 'px';
            }
        }
        
        adjustPageContentPadding();
        window.addEventListener('resize', adjustPageContentPadding);

        window.addEventListener('scroll', function() {
            if (!nav || !navLogo) return;
            if (window.scrollY > 50) {
                nav.style.backgroundColor = 'rgba(255, 165, 0, 0.9)';
                nav.style.padding = `5px ${initialNavPaddingLeftRight}px`;
                navLogo.style.height = (initialLogoHeight * 0.8) + 'px';
            } else {
                nav.style.backgroundColor = 'orange';
                nav.style.padding = `${initialNavPaddingTopBottom}px ${initialNavPaddingLeftRight}px`;
                navLogo.style.height = initialLogoHeight + 'px';
            }
            adjustPageContentPadding(); 
        });

        // Hero Carousel Logic
        if (heroCarouselElement) {
            const slidesContainer = heroCarouselElement.querySelector('.slides-container');
            const slides = Array.from(heroCarouselElement.querySelectorAll('.slide'));
            const prevButton = heroCarouselElement.querySelector('.prev');
            const nextButton = heroCarouselElement.querySelector('.next');
            const dotsContainer = heroCarouselElement.querySelector('.carousel-dots');
            let currentIndex = 0;
            let slideInterval;

            function updateCarousel() {
                if (!slidesContainer || slides.length === 0) return; 
                slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                if (dotsContainer) {
                     Array.from(dotsContainer.children).forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentIndex);
                    });
                }
            }
            
            function createDots() {
                if(!dotsContainer || slides.length === 0) return; 
                dotsContainer.innerHTML = ''; 
                slides.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (index === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        currentIndex = index;
                        updateCarousel();
                        resetInterval();
                    });
                    dotsContainer.appendChild(dot);
                });
            }

            function nextSlide() {
                if (slides.length === 0) return;
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            }
            function prevSlide() {
                if (slides.length === 0) return;
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            }
            function startInterval() {
                if (slides.length > 1) { 
                     slideInterval = setInterval(nextSlide, 5000);
                }
            }
            function resetInterval() {
                clearInterval(slideInterval);
                startInterval();
            }

            if (slides.length > 0) {
                if (prevButton) prevButton.addEventListener('click', () => { prevSlide(); resetInterval(); });
                if (nextButton) nextButton.addEventListener('click', () => { nextSlide(); resetInterval(); });
                createDots();
                startInterval();
                updateCarousel(); 
            }
        }


        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href') === '#') { // Bỏ qua nếu href chỉ là "#"
                    // Bạn có thể muốn e.preventDefault() ở đây nếu không muốn hành vi mặc định
                    return; 
                }
                try {
                    // Thử lấy ID từ href (ví dụ: #section1 -> section1)
                    const targetId = this.getAttribute('href').substring(1);
                    if (!targetId) return; // Nếu không có ID (ví dụ href="#") thì bỏ qua

                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        const navbarHeight = document.getElementById('mainNavbar') ? document.getElementById('mainNavbar').offsetHeight : 70;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                } catch (error) { console.warn('Smooth scroll error:', error); }
            });
        });

        // Back to Top Button
        const backToTopButton = document.createElement('button');
        backToTopButton.innerHTML = "<i class='bx bx-chevron-up'></i>"; 
        Object.assign(backToTopButton.style, {
            position: 'fixed', bottom: '30px', right: '30px',
            backgroundColor: 'orange', color: 'white',
            border: 'none', borderRadius: '50%',
            width: '50px', height: '50px', fontSize: '28px',
            cursor: 'pointer', display: 'none', zIndex: '1001',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            lineHeight: '50px', textAlign: 'center'
        });
        document.body.appendChild(backToTopButton);
        window.addEventListener('scroll', () => {
            backToTopButton.style.display = (window.pageYOffset > 200) ? 'block' : 'none';
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        console.log("Gà Rán MFC");
    });
    // Thêm vào trong document.addEventListener('DOMContentLoaded', function() { ... });
// Hoặc tạo một khối script mới nếu muốn
    const sectionTitleBar = document.querySelector('.section-title-bar');

    // Hàm kiểm tra xem một phần tử có trong viewport hay không
    function isElementInViewport(el) {
        if (!el) return false; // Thêm kiểm tra null
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Hàm xử lý khi cuộn trang
    function handleScrollReveal() {
        if (sectionTitleBar && isElementInViewport(sectionTitleBar)) {
            sectionTitleBar.classList.add('is-visible');
            // Remove event listener once element is visible to prevent unnecessary checks
            window.removeEventListener('scroll', handleScrollReveal);
        }
    }

    // Gắn lắng nghe sự kiện cuộn trang
    window.addEventListener('scroll', handleScrollReveal);

    // Chạy kiểm tra một lần khi tải trang để xử lý nếu phần tử đã ở trong viewport ngay lập tức
    handleScrollReveal();