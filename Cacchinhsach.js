document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('mainNavbar');
    const navbarLogo = document.getElementById('navbarLogo');
    const pageContainer = document.querySelector('.page-container');

    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMobileMenu = document.getElementById('closeMobileMenu');

    const searchIcon = document.getElementById('searchIcon');
    const fullScreenSearchOverlay = document.getElementById('fullScreenSearchOverlay');
    const overlayCloseBtn = document.getElementById('overlayCloseBtn');
    const overlaySearchInput = document.getElementById('overlaySearchInput');

    let defaultPaddingTopBottom = 15; // Default padding for navbar
    let defaultLogoHeight = 70; // Default logo height

    // Get computed styles for initial values if elements exist
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

    // Function to adjust page padding based on navbar height
    function adjustPagePadding() {
        if (navbar) {
            if (pageContainer) {
                pageContainer.style.paddingTop = navbar.offsetHeight + 'px';
            } else {
                // Fallback for pages without .page-container (e.g., index.html body)
                document.body.style.paddingTop = navbar.offsetHeight + 'px';
            }
        }
    }

    // Adjust padding on load
    adjustPagePadding();

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) { // Adjust scroll threshold as needed
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            adjustPagePadding(); // Re-adjust padding when navbar height changes
        }
    });

    // Mobile menu toggle
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            if (mobileMenu) {
                mobileMenu.classList.add('active');
            }
        });
    }

    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', function() {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
        });
    }

    // Mobile dropdown toggle
    document.querySelectorAll('.dropdown-mobile .dropbtn-mobile').forEach(function(dropbtn) {
        dropbtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            const dropdownContent = this.nextElementSibling;
            if (dropdownContent) {
                dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
                this.querySelector('i').classList.toggle('bx-chevron-down');
                this.querySelector('i').classList.toggle('bx-chevron-up');
            }
        });
    });

    // Search overlay toggle
    if (searchIcon) {
        searchIcon.addEventListener('click', function(event) {
            event.preventDefault();
            if (fullScreenSearchOverlay) {
                fullScreenSearchOverlay.classList.add('active');
                overlaySearchInput.focus(); // Focus on the input when opened
            }
        });
    }

    if (overlayCloseBtn) {
        overlayCloseBtn.addEventListener('click', function() {
            if (fullScreenSearchOverlay) {
                fullScreenSearchOverlay.classList.remove('active');
            }
        });
    }

    // Close search overlay if clicking outside the input area but within the overlay
    if (fullScreenSearchOverlay) {
        fullScreenSearchOverlay.addEventListener('click', function(event) {
            if (event.target === fullScreenSearchOverlay) {
                fullScreenSearchOverlay.classList.remove('active');
            }
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');

            // Close all other open answers
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    otherQuestion.closest('.faq-item').querySelector('.faq-answer').classList.remove('active');
                    otherQuestion.closest('.faq-item').querySelector('.faq-answer').style.maxHeight = '0';
                }
            });

            // Toggle current answer
            question.classList.toggle('active');
            answer.classList.toggle('active');

            if (answer.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px'; // Set max-height to scrollHeight for smooth transition
            } else {
                answer.style.maxHeight = '0'; // Use '0' for smooth collapse
            }
        });
    });

    // FAQ Search functionality
    const faqSearchInput = document.getElementById('faqSearch');
    if (faqSearchInput) {
        faqSearchInput.addEventListener('keyup', function() {
            filterFAQItems(this.value);
        });
    }

    function filterFAQItems(searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        faqQuestions.forEach(question => {
            const faqItem = question.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const questionText = question.textContent.toLowerCase();
            const answerText = answer.textContent.toLowerCase();

            if (questionText.includes(searchTermLower) || answerText.includes(searchTermLower)) {
                faqItem.style.display = 'block'; // Show item
                // If search term is present, expand the answer for better visibility
                if (!question.classList.contains('active')) {
                    question.classList.add('active');
                    answer.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            } else {
                faqItem.style.display = 'none'; // Hide item
                // If item does not match search term, ensure it's collapsed
                question.classList.remove('active');
                answer.classList.remove('active');
                answer.style.maxHeight = '0';
            }
        });
    }


    // Handle clicks on support info cards
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
                    const offset = navbar ? navbar.offsetHeight + 20 : 0; // Add some extra offset
                    window.scrollTo({
                        top: targetElement.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Adjust page padding on window resize as well
    window.addEventListener('resize', adjustPagePadding);
});
