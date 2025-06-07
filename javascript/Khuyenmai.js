document.addEventListener('DOMContentLoaded', () => {
    const btnPrev = document.querySelector('.button.prev');
    const btnNext = document.querySelector('.button.next');
    const btnPage1 = document.querySelector('.Khuyen_mai_page1');
    const btnPage2 = document.querySelector('.Khuyen_mai_page2');
    const pagination = document.querySelector('.pagination');
    
    
    const footer = document.querySelector('footer'); 

    
    function getCurrentPage() {
        const path = window.location.pathname;
        const file = path.substring(path.lastIndexOf('/') + 1);
        return file;
    }

    const currentPage = getCurrentPage();

   
    function goToPage(page) {
        if (page === 'page1') {
            window.location.href = 'Khuyen_mai_page1.html';
        } else if (page === 'page2') {
            window.location.href = 'Khuyen_mai_page2.html';
        }
    }

    
    btnPrev.addEventListener('click', () => {
        if (currentPage === 'Khuyen_mai_page2.html') {
            goToPage('page1');
        }
    });


    btnNext.addEventListener('click', () => {
        if (currentPage === 'Khuyen_mai_page1.html') {
            goToPage('page2');
        }
    });

   
    btnPage1.addEventListener('click', () => {
        if (currentPage !== 'Khuyen_mai_page1.html') {
            goToPage('page1');
        }
    });

    
    btnPage2.addEventListener('click', () => {
        if (currentPage !== 'Khuyen_mai_page2.html') {
            goToPage('page2');
        }
    });

    
    function checkPaginationVisibility() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight; 
        const documentHeight = document.body.offsetHeight;

        let footerTop = documentHeight; 

       
        if (footer) {
            
            footerTop = footer.getBoundingClientRect().top + scrollY;
        }

        const triggerPoint = footerTop - 100; 

       
        if ((scrollY + windowHeight >= triggerPoint) || (documentHeight <= windowHeight)) {
            pagination.classList.add('visible');
        } else {
            pagination.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', checkPaginationVisibility);
    window.addEventListener('resize', checkPaginationVisibility);
    checkPaginationVisibility(); 
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