document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('mainNavbar');
    const navbarLogo = document.getElementById('navbarLogo');
    const pageContainer = document.querySelector('.page-container'); // This might not exist in your HTML, fallback to body
    
    // Hamburger Menu elements for mobile
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');

    // Full screen search overlay elements
    const fullScreenSearchToggle = document.getElementById('fullScreenSearchToggle');
    const fullScreenSearchOverlay = document.getElementById('fullScreenSearchOverlay');
    const overlayCloseBtn = document.getElementById('overlayCloseBtn');
    const overlaySearchInput = document.getElementById('overlaySearchInput');
    const heroSearchInput = document.getElementById('heroSearchInput'); // The search input on the hero banner

    // Get default padding and logo height from CSS when DOMContentLoaded
    let defaultPaddingTopBottom = 15; // Set to initial padding from CSS for fixed-navbar
    let defaultLogoHeight = 70; // Set to initial logo height from CSS

    if (navbar) {
        const computedStyle = window.getComputedStyle(navbar);
        const paddingValues = computedStyle.padding.split(" ");
        if (paddingValues.length === 1) {
            defaultPaddingTopBottom = parseFloat(paddingValues[0]);
        } else if (paddingValues.length >= 2) {
            defaultPaddingTopBottom = parseFloat(paddingValues[0]);
        }
    }
    if (navbarLogo) {
        defaultLogoHeight = navbarLogo.offsetHeight || 70;
    }

    // Function to adjust body's padding-top so content isn't hidden by the navbar
    function adjustPagePadding() {
        if (navbar) {
            if (pageContainer) {
                pageContainer.style.paddingTop = navbar.offsetHeight + 'px';
            } else {
                document.body.style.paddingTop = navbar.offsetHeight + 'px';
            }
        }
    }
    adjustPagePadding(); // Call for the first time on page load

    // Adjust padding and logo size on scroll
    window.addEventListener('scroll', function() {
        if (!navbar || !navbarLogo) return;

        const currentNavbarStyle = window.getComputedStyle(navbar);
        // Get current left/right padding to maintain it, only changing top/bottom
        let currentPaddingLeftRight = parseFloat(currentNavbarStyle.padding.split(" ")[1] || currentNavbarStyle.padding.split(" ")[0]);

        if (window.scrollY > 50) {
            navbar.style.padding = `${defaultPaddingTopBottom - 5}px ${currentPaddingLeftRight}px`;
            navbar.style.boxShadow = '0 3px 15px rgba(0, 0, 0, 0.1)'; // Lighter shadow for white navbar
            navbarLogo.style.height = `${defaultLogoHeight * 0.8}px`;
        } else {
            navbar.style.padding = `${defaultPaddingTopBottom}px ${currentPaddingLeftRight}px`;
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)'; // Original shadow
            navbarLogo.style.height = `${defaultLogoHeight}px`;
        }
        adjustPagePadding();
    });

    // Hamburger Menu Toggle for Mobile
    if (hamburgerMenu && mobileMenu) {
        hamburgerMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            // Prevent scrolling on body when mobile menu is open
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !hamburgerMenu.contains(event.target) && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        // Also close mobile menu if a link inside it is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Full Screen Search Overlay logic
    if (fullScreenSearchToggle && fullScreenSearchOverlay && overlayCloseBtn) {
        fullScreenSearchToggle.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            fullScreenSearchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when overlay is active
            overlaySearchInput.focus(); // Focus on the search input when opened
        });

        overlayCloseBtn.addEventListener('click', function() {
            fullScreenSearchOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });

        // Close overlay when clicking outside the content (but within the overlay)
        fullScreenSearchOverlay.addEventListener('click', function(event) {
            if (event.target === fullScreenSearchOverlay) {
                fullScreenSearchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Map Fade-in Animation
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mapContainer.classList.add('fade-in');
                    observer.unobserve(mapContainer);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(mapContainer);
    }

    // Form Validation
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            let allValid = true;
            let errorMessages = [];

            function validateField(inputElement, errorMessage) {
                if (!inputElement.value.trim()) {
                    inputElement.classList.add('invalid-input');
                    return errorMessage;
                }
                // Check if input element supports checkValidity (e.g., email, tel with pattern)
                if (inputElement.checkValidity && !inputElement.checkValidity()) {
                    inputElement.classList.add('invalid-input');
                    return inputElement.title || 'Giá trị không hợp lệ.';
                }
                inputElement.classList.remove('invalid-input');
                return null;
            }

            let error;

            error = validateField(nameInput, 'Vui lòng nhập tên của bạn.');
            if (error) { allValid = false; errorMessages.push(error); }

            error = validateField(emailInput, 'Vui lòng nhập địa chỉ email hợp lệ.');
            if (error) { allValid = false; errorMessages.push(error); }

            error = validateField(phoneInput, 'Vui lòng nhập số điện thoại hợp lệ (10 hoặc 11 chữ số).');
            if (error) { allValid = false; errorMessages.push(error); }

            error = validateField(subjectInput, 'Vui lòng nhập chủ đề.');
            if (error) { allValid = false; errorMessages.push(error); }

            error = validateField(messageInput, 'Vui lòng nhập nội dung phản hồi.');
            if (error) { allValid = false; errorMessages.push(error); }


            if (!allValid) {
                alert('Vui lòng sửa các lỗi sau để gửi phản hồi:\n' + errorMessages.join('\n'));
            } else {
                alert('Form đã được gửi thành công! Cảm ơn phản hồi của bạn.');
                console.log('Form data:', {
                    name: nameInput.value,
                    email: emailInput.value,
                    phone: phoneInput.value,
                    subject: subjectInput.value,
                    message: messageInput.value
                });
                feedbackForm.reset();
            }
        });
    }

    // Smooth scroll for internal links (both in overlay and main page)
    document.querySelectorAll('.scroll-to-element, .overlay-nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) { // Only handle internal links
                e.preventDefault();

                const targetId = href.substring(1); // Get ID without '#'
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const offset = navbar ? navbar.offsetHeight + 20 : 0; // Offset by navbar height + some margin
                    window.scrollTo({
                        top: targetElement.offsetTop - offset,
                        behavior: 'smooth'
                    });
                    // Close the overlay if the link was clicked inside it
                    if (fullScreenSearchOverlay.classList.contains('active')) {
                        fullScreenSearchOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            }
        });
    });

    // Handle search input on hero banner (optional, if you want it to trigger something)
    if (heroSearchInput) {
        heroSearchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                alert('Tìm kiếm trên banner: ' + this.value);
                // Thực hiện hành động tìm kiếm hoặc chuyển hướng
            }
        });
    }

    // Ensure padding body is recalculated when window resizes
    window.addEventListener('resize', adjustPagePadding);
});