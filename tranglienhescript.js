document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('mainNavbar');
    const navbarLogo = document.getElementById('navbarLogo');
    const pageContainer = document.querySelector('.page-container');
    
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');

    const fullScreenSearchOverlay = document.getElementById('fullScreenSearchOverlay');
    const overlayCloseBtn = document.getElementById('overlayCloseBtn');
    const overlaySearchInput = document.getElementById('overlaySearchInput');

    let defaultPaddingTopBottom = 15;
    let defaultLogoHeight = 70;

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

    function adjustPagePadding() {
        if (navbar) {
            if (pageContainer) {
                pageContainer.style.paddingTop = navbar.offsetHeight + 'px';
            } else {
                document.body.style.paddingTop = navbar.offsetHeight + 'px';
            }
        }
    }
    adjustPagePadding();

    window.addEventListener('scroll', function() {
        if (!navbar || !navbarLogo) return;

        const currentNavbarStyle = window.getComputedStyle(navbar);
        let currentPaddingLeftRight = parseFloat(currentNavbarStyle.padding.split(" ")[1] || currentNavbarStyle.padding.split(" ")[0]);

        if (window.scrollY > 50) {
            navbar.style.padding = `${defaultPaddingTopBottom - 5}px ${currentPaddingLeftRight}px`;
            navbar.style.boxShadow = '0 3px 15px rgba(0, 0, 0, 0.1)';
            navbarLogo.style.height = `${defaultLogoHeight * 0.8}px`;
        } else {
            navbar.style.padding = `${defaultPaddingTopBottom}px ${currentPaddingLeftRight}px`;
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
            navbarLogo.style.height = `${defaultLogoHeight}px`;
        }
        adjustPagePadding();
    });

    if (hamburgerMenu && mobileMenu) {
        hamburgerMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !hamburgerMenu.contains(event.target) && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    if (fullScreenSearchOverlay && overlayCloseBtn) {
        overlayCloseBtn.addEventListener('click', function() {
            fullScreenSearchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            overlaySearchInput.value = '';
            performSearch();
        });

        fullScreenSearchOverlay.addEventListener('click', function(event) {
            if (event.target === fullScreenSearchOverlay) {
                fullScreenSearchOverlay.classList.remove('active');
                document.body.style.overflow = '';
                overlaySearchInput.value = '';
                performSearch();
            }
        });
    }

    // Intersection Observer for scroll-reveal sections
    const scrollRevealSections = document.querySelectorAll('.scroll-reveal');
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, observerOptions);

    scrollRevealSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Specific Map fade-in
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        const mapObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mapContainer.classList.add('revealed');
                    mapObserver.unobserve(mapContainer);
                }
            });
        }, { threshold: 0.1 });

        mapObserver.observe(mapContainer);
    }

    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(event) {
            event.preventDefault();

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

    document.querySelectorAll('.scroll-to-element, .overlay-nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const dataScrollTo = this.getAttribute('data-scroll-to');

            if (dataScrollTo) {
                e.preventDefault();
                const targetElement = document.querySelector(dataScrollTo);
                if (targetElement) {
                    const offset = navbar ? navbar.offsetHeight + 20 : 0;
                    window.scrollTo({
                        top: targetElement.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            } else if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const offset = navbar ? navbar.offsetHeight + 20 : 0;
                    window.scrollTo({
                        top: targetElement.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            }

            if (fullScreenSearchOverlay.classList.contains('active')) {
                fullScreenSearchOverlay.classList.remove('active');
                document.body.style.overflow = '';
                overlaySearchInput.value = '';
            }
        });
    });

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;

            // Close other open FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    otherQuestion.nextElementSibling.classList.remove('active');
                    otherQuestion.nextElementSibling.style.maxHeight = null;
                }
            });

            question.classList.toggle('active');

            if (answer.classList.contains('active')) {
                answer.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                answer.classList.add('active');
                // Use scrollHeight to correctly set max-height based on content
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    if (overlaySearchInput) {
        overlaySearchInput.addEventListener('input', performSearch);
    }

    function performSearch() {
        const searchTerm = overlaySearchInput.value.toLowerCase().trim();

        const infoCards = document.querySelectorAll('.support-info-section .info-contact-card');
        const faqItems = document.querySelectorAll('.faq-section .faq-item');

        infoCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const itemText = question.textContent.toLowerCase() + ' ' + answer.textContent.toLowerCase();

            if (itemText.includes(searchTerm)) {
                item.style.display = 'block';
                if (searchTerm !== '' && !answer.classList.contains('active')) {
                    question.classList.add('active');
                    answer.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else if (searchTerm === '' && answer.classList.contains('active')) {
                    // If search term is cleared, collapse open FAQs
                    question.classList.remove('active');
                    answer.classList.remove('active');
                    answer.style.maxHeight = null;
                }
            } else {
                item.style.display = 'none';
            }
        });
    }

    // New: Handle clicks on support info cards
    const infoContactCards = document.querySelectorAll('.info-contact-card');
    infoContactCards.forEach(card => {
        card.addEventListener('click', function(event) {
            // Prevent default link behavior if an internal link is clicked inside the card
            if (event.target.tagName === 'A' || event.target.closest('a')) {
                return;
            }

            const link = this.dataset.link;
            const scrollTo = this.dataset.scrollTo;

            if (link) {
                window.location.href = link;
            } else if (scrollTo) {
                const targetElement = document.querySelector(scrollTo);
                if (targetElement) {
                    const offset = navbar ? navbar.offsetHeight + 20 : 0;
                    window.scrollTo({
                        top: targetElement.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    window.addEventListener('resize', adjustPagePadding);
});