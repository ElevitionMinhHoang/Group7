

let cart = []; 

/**
 * 
 * @param {number} amount 
 * @returns {string} 
 */
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
}

/**
 * 
 * @param {string} id 
 * @param {string} name 
 * @param {number} price 
 * @param {number} [quantity=1] 
 */
function addItemToCart(id, name, price, quantity = 1) {
    const existingItemIndex = cart.findIndex(item => item.id === id);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ id, name, price, quantity });
    }
}


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
    const grandTotal = subtotal; 
    cartGrandTotalElement.textContent = formatCurrency(grandTotal);
}


function addInitialItemsToCart() {
    addItemToCart("combo-cong-chua", "Combo Công chúa", 120000, 1);
    addItemToCart("tra-quat", "Trà quất", 20000, 1);
    renderCartSummary();
}


document.addEventListener('DOMContentLoaded', () => {
    
    addInitialItemsToCart();

    
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

            
            if (cart.length === 0) {
                alert("Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng!");
                return;
            }

            
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

            
            if (!/^(0\d{9})$/.test(customerPhone)) {
                alert("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại (phải là 10 số, bắt đầu bằng 0).");
                if (customerPhoneInput) customerPhoneInput.style.borderColor = 'red';
                return;
            } else {
                if (customerPhoneInput) customerPhoneInput.style.borderColor = '#ddd';
            }

           
            if (successAlertElement) {
                successAlertElement.classList.add('visible');
            } else {
                
                alert("Đơn hàng của bạn đã được ghi nhận (lỗi hiển thị thông báo tùy chỉnh)");
            }

            
            setTimeout(() => {
                if (successAlertElement) {
                     successAlertElement.classList.remove('visible'); 
                }
                window.location.href = "../Thuc_Don/ThucDon.html";
            }, 2500); 
        });
    }

   
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


        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href') === '#') { 
                    return; 
                }
                try {
                    
                    const targetId = this.getAttribute('href').substring(1);
                    if (!targetId) return; 

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
    
    const sectionTitleBar = document.querySelector('.section-title-bar');

    
    function isElementInViewport(el) {
        if (!el) return false; 
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    
    function handleScrollReveal() {
        if (sectionTitleBar && isElementInViewport(sectionTitleBar)) {
            sectionTitleBar.classList.add('is-visible');
            
            window.removeEventListener('scroll', handleScrollReveal);
        }
    }

    
    window.addEventListener('scroll', handleScrollReveal);

    
    handleScrollReveal();