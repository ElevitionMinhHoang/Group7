/* === NỘI DUNG JAVASCRIPT ĐÃ ĐƯỢC BỔ SUNG LOGIC PHÂN TRANG === */
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. LẤY CÁC PHẦN TỬ HTML ---
    const mainNavbar = document.getElementById('mainNavbar');
    const secondaryNavbar = document.getElementById('secondaryNavbar');
    const mainContent = document.getElementById('mainContent');
    const sections = document.querySelectorAll("main > section.section");
    const navLinks = document.querySelectorAll(".navbar a");
    const mainNavLogo = document.getElementById('navbarLogo');
    const pageContentWrapper = document.querySelector('.page-content-wrapper') || mainContent;

    // --- 2. BIẾN LƯU TRỮ CÁC GIÁ TRỊ BAN ĐẦU ---
    let initialMainNavbarPaddingTopBottom = 15;
    let initialMainNavbarPaddingLeftRight = 50;
    let initialMainNavbarLogoHeight = 60;

    // --- 3. CÁC HÀM CHỨC NĂNG ---

    function getMainNavbarInitialStyles() {
        if (mainNavbar) {
            const computedStyle = window.getComputedStyle(mainNavbar);
            initialMainNavbarPaddingTopBottom = parseFloat(computedStyle.paddingTop) || 15;
            initialMainNavbarPaddingLeftRight = parseFloat(computedStyle.paddingLeft) || 50;
        }
        if (mainNavLogo && mainNavLogo.complete && mainNavLogo.naturalHeight > 0) {
            initialMainNavbarLogoHeight = mainNavLogo.offsetHeight || 60;
        }
    }

    function updateLayout() {
        let mainNavbarHeight = (mainNavbar && window.getComputedStyle(mainNavbar).display !== 'none') ? mainNavbar.offsetHeight : 0;
        let secondaryNavbarHeight = secondaryNavbar ? secondaryNavbar.offsetHeight : 0;
        const totalNavbarHeight = mainNavbarHeight + secondaryNavbarHeight;
        
        if (secondaryNavbar) {
            secondaryNavbar.style.top = mainNavbarHeight + 'px';
        }
        
        const contentContainer = pageContentWrapper || document.body;
        contentContainer.style.paddingTop = totalNavbarHeight + 'px';

        sections.forEach(section => {
            if (section) {
                section.style.scrollMarginTop = totalNavbarHeight + 'px';
            }
        });
    }

    function scrollToSection(targetSection) {
        if (!targetSection) return;
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function handleScroll() {
        if (mainNavbar && mainNavLogo) {
            if (window.scrollY > 50) {
                mainNavbar.style.backgroundColor = 'rgba(255, 165, 0, 0.95)';
                mainNavbar.style.paddingTop = '8px';
                mainNavbar.style.paddingBottom = '8px';
                mainNavLogo.style.height = (initialMainNavbarLogoHeight * 0.8) + 'px';
            } else {
                mainNavbar.style.backgroundColor = 'orange';
                mainNavbar.style.paddingTop = initialMainNavbarPaddingTopBottom + 'px';
                mainNavbar.style.paddingBottom = initialMainNavbarPaddingTopBottom + 'px';
                mainNavLogo.style.height = initialMainNavbarLogoHeight + 'px';
            }
        }
        
        let currentSectionId = "";
        const totalNavbarHeight = (mainNavbar ? mainNavbar.offsetHeight : 0) + (secondaryNavbar ? secondaryNavbar.offsetHeight : 0);
        const activationPoint = totalNavbarHeight + 10;

        sections.forEach((section) => {
            if(section){
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (window.pageYOffset >= sectionTop - activationPoint && 
                    window.pageYOffset < sectionTop + sectionHeight - activationPoint) {
                    currentSectionId = section.getAttribute("id");
                }
            }
        });
        
        if (!currentSectionId && sections.length > 0 && window.pageYOffset < sections[0].offsetTop - totalNavbarHeight) {
            currentSectionId = sections[0].getAttribute("id");
        }

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + currentSectionId) {
                link.classList.add("active");
            }
        });
        
        requestAnimationFrame(updateLayout);
    }

    // --- 4. GÁN CÁC SỰ KIỆN ---

    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            scrollToSection(targetSection);
        });
    });
    
    window.addEventListener("scroll", handleScroll);

    window.addEventListener('resize', () => {
        getMainNavbarInitialStyles();
        updateLayout();
    });

    // ==========================================================
    // === BỔ SUNG LOGIC PHÂN TRANG CHO THỰC ĐƠN TẠI ĐÂY ===
    // ==========================================================
    const btnPrev = document.querySelector('.pagination .prev');
    const btnNext = document.querySelector('.pagination .next');
    const btnPage1 = document.querySelector('.pagination .thuc_don1');
    const btnPage2 = document.querySelector('.pagination .thuc_don2');

    // Hàm lấy tên file hiện tại
    function getCurrentMenuPage() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf('/') + 1);
    }

    const currentMenuPage = getCurrentMenuPage();

    // Xử lý sự kiện cho nút Next và nút số 2
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            // Chỉ chuyển trang nếu đang ở trang 1
            if (currentMenuPage === 'thuc_don1.html') {
                window.location.href = 'thuc_don2.html';
            }
        });
    }
    if (btnPage2) {
        btnPage2.addEventListener('click', () => {
             // Chỉ chuyển trang nếu đang không ở trang 2
            if (currentMenuPage !== 'thuc_don2.html') {
                window.location.href = 'thuc_don2.html';
            }
        });
    }

    // Xử lý sự kiện cho nút Prev và nút số 1
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            // Chỉ chuyển trang nếu đang ở trang 2
            if (currentMenuPage === 'thuc_don2.html') {
                window.location.href = 'thuc_don1.html';
            }
        });
    }
    if (btnPage1) {
        btnPage1.addEventListener('click', () => {
            // Chỉ chuyển trang nếu đang không ở trang 1
            if (currentMenuPage !== 'thuc_don1.html') {
                window.location.href = 'thuc_don1.html';
            }
        });
    }
    
    // --- 5. KHỞI TẠO ỨNG DỤNG ---
    function initializeApp() {
        getMainNavbarInitialStyles(); 
        updateLayout();
        handleScroll();
    }

    window.addEventListener('load', initializeApp);

    if (document.readyState !== 'loading') {
        initializeApp();
    }
});