document.addEventListener('DOMContentLoaded', function() {
    const mainNavbar = document.getElementById('mainNavbar');
    const secondaryNavbar = document.getElementById('secondaryNavbar');
    const mainContent = document.getElementById('mainContent');
    const sections = document.querySelectorAll("main > section.section");
    const navLinks = document.querySelectorAll(".navbar a"); // Links của thanh menu phụ
    const mainNavLogo = document.getElementById('navbarLogo');

    let initialMainNavbarPaddingTopBottom = 10;
    let initialMainNavbarPaddingLeftRight = 40;
    let initialMainNavbarLogoHeight = 50; // Giá trị mặc định

    function getMainNavbarInitialStyles() {
        if (mainNavbar) {
            const computedStyle = window.getComputedStyle(mainNavbar);
            initialMainNavbarPaddingTopBottom = parseFloat(computedStyle.paddingTop) || 10;
            initialMainNavbarPaddingLeftRight = parseFloat(computedStyle.paddingLeft) || 40;
        }
        if (mainNavLogo) {
            // Cố gắng lấy chiều cao thực tế sau khi ảnh tải xong, nếu không được thì dùng giá trị mặc định
            if (mainNavLogo.complete && mainNavLogo.naturalHeight !== 0 && mainNavLogo.offsetHeight > 0) {
                initialMainNavbarLogoHeight = mainNavLogo.offsetHeight;
            } else if (mainNavLogo.offsetHeight > 0) { // Nếu chưa complete nhưng có offsetHeight
                 initialMainNavbarLogoHeight = mainNavLogo.offsetHeight;
            } else { // Fallback
                initialMainNavbarLogoHeight = 50;
            }
        } else {
            initialMainNavbarLogoHeight = 50; // Fallback nếu logo không tồn tại
        }
    }

    function updateLayout() {
        let mainNavbarHeight = 0;
        if (mainNavbar && window.getComputedStyle(mainNavbar).display !== 'none') {
            mainNavbarHeight = mainNavbar.offsetHeight;
        }

        let secondaryNavbarHeight = 0;
        if (secondaryNavbar) {
            secondaryNavbar.style.top = mainNavbarHeight + 'px';
            secondaryNavbarHeight = secondaryNavbar.offsetHeight;
        }

        const totalNavbarHeight = mainNavbarHeight + secondaryNavbarHeight;

        if (mainContent) {
            mainContent.style.paddingTop = totalNavbarHeight + 'px';
        } else {
            document.body.style.paddingTop = totalNavbarHeight + 'px';
        }

        sections.forEach(section => {
            if (section) { // Kiểm tra section tồn tại
                 section.style.scrollMarginTop = totalNavbarHeight + 'px';
            }
        });
    }

    function scrollToSection(targetSection) {
        if (!targetSection) return;
        // Không cần tính toán offset phức tạp ở đây nếu scrollMarginTop đã được set đúng
        const yOffset = - ( (mainNavbar ? mainNavbar.offsetHeight : 0) + (secondaryNavbar ? secondaryNavbar.offsetHeight : 0) );
        // Thay vào đó, dựa vào scrollMarginTop
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                 // Đảm bảo layout đã được cập nhật trước khi cuộn
                requestAnimationFrame(() => {
                    scrollToSection(targetSection);
                });
            }
        });
    });

    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        const mainNavHeight = (mainNavbar && window.getComputedStyle(mainNavbar).display !== 'none' ? mainNavbar.offsetHeight : 0);
        const secondaryNavHeight = (secondaryNavbar ? secondaryNavbar.offsetHeight : 0);
        const totalNavbarHeight = mainNavHeight + secondaryNavHeight;
        
        // Offset từ đỉnh viewport để xác định section nào là "active"
        // Có thể là một giá trị cố định (ví dụ: 10px dưới navbar phụ) hoặc % chiều cao viewport
        const activationPoint = totalNavbarHeight + 10; // 10px dưới thanh navbar phụ

        sections.forEach((section) => {
            if(section){
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                // Active khi đỉnh của section vượt qua điểm kích hoạt một chút, và chưa cuộn qua hết section đó
                if (window.pageYOffset >= sectionTop - activationPoint && 
                    window.pageYOffset < sectionTop + sectionHeight - activationPoint) {
                    currentSectionId = section.getAttribute("id");
                }
            }
        });
        
        // Nếu không có section nào khớp (ví dụ cuộn lên trên cùng)
        if (!currentSectionId && sections.length > 0 && window.pageYOffset < sections[0].offsetTop - totalNavbarHeight) {
             currentSectionId = sections[0].getAttribute("id"); // Mặc định active section đầu tiên
        }


        navLinks.forEach((link) => {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
            if (link.getAttribute("href") === "#" + currentSectionId) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        });
    });

    // Hiệu ứng cuộn cho thanh navbar chính
// Hiệu ứng cuộn cho thanh navbar chính
window.addEventListener('scroll', function() {
    if (!mainNavbar || !mainNavLogo) return;

    let mainNavbarHeightBeforeChange = mainNavbar.offsetHeight; // Lấy chiều cao TRƯỚC khi thay đổi style

    // Sử dụng giá trị initial đã được lấy ổn định hơn
    let currentInitialLogoHeight = initialMainNavbarLogoHeight;

    if (window.scrollY > 50) {
        mainNavbar.style.backgroundColor = 'rgba(255, 165, 0, 0.95)';
        mainNavbar.style.paddingTop = '8px';
        mainNavbar.style.paddingBottom = '8px';
        mainNavLogo.style.height = (currentInitialLogoHeight * 0.85) + 'px';
    } else {
        mainNavbar.style.backgroundColor = 'orange';
        mainNavbar.style.paddingTop = initialMainNavbarPaddingTopBottom + 'px';
        mainNavbar.style.paddingBottom = initialMainNavbarPaddingTopBottom + 'px';
        mainNavLogo.style.height = currentInitialLogoHeight + 'px';
    }

    // Quan trọng: Gọi updateLayout NGAY SAU KHI style của mainNavbar đã được thay đổi
    // và trình duyệt có cơ hội tính toán lại offsetHeight mới.
    // requestAnimationFrame giúp đảm bảo điều này.
    requestAnimationFrame(() => {
        let mainNavbarHeightAfterChange = mainNavbar.offsetHeight;
        if (mainNavbarHeightBeforeChange !== mainNavbarHeightAfterChange) {
            updateLayout(); // Gọi updateLayout để cập nhật vị trí thanh phụ và padding nội dung
        }
    });
});
    
    function initializeApp() {
        getMainNavbarInitialStyles(); 
        updateLayout();
    }

    if (document.readyState === 'loading') { // DOM chưa sẵn sàng
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else { // DOM đã sẵn sàng
        initializeApp();
    }

    window.addEventListener('resize', () => {
        getMainNavbarInitialStyles();
        updateLayout();
    });
    // 'load' event thường tốt hơn để đảm bảo tất cả tài nguyên (như ảnh) đã tải
    window.addEventListener('load', () => { 
        getMainNavbarInitialStyles(); // Lấy lại chiều cao logo sau khi ảnh đã chắc chắn tải
        updateLayout();
    });

});