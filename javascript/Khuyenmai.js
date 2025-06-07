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