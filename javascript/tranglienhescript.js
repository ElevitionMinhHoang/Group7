document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('mainNavbar');
    const navbarLogo = document.getElementById('navbarLogo');

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
           
            document.body.style.paddingTop = navbar.offsetHeight + 'px';
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


    const scrollRevealSections = document.querySelectorAll('.scroll-reveal');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    scrollRevealSections.forEach(section => {
        sectionObserver.observe(section);
    });


    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
           
            const messageInput = document.getElementById('message');

            let allValid = true;
            let errorMessages = [];

          
            function validateField(inputElement, errorMessage) {
                let currentErrorMessage = null;
                if (!inputElement.value.trim()) {
                    currentErrorMessage = errorMessage;
                } else if (inputElement.checkValidity && !inputElement.checkValidity()) {
                    currentErrorMessage = inputElement.title || 'Giá trị không hợp lệ.';
                }

                
                if (inputElement.id === 'phone') {
                    const phoneRegex = /^(0|84)(3|5|7|8|9)\d{8}$/; 
                    if (!phoneRegex.test(inputElement.value.trim())) {
                        currentErrorMessage = 'Vui lòng nhập số điện thoại hợp lệ (ví dụ: 0912345678 hoặc 84912345678).';
                    }
                }

                if (currentErrorMessage) {
                    inputElement.classList.add('invalid-input');
                    return currentErrorMessage;
                } else {
                    inputElement.classList.remove('invalid-input');
                    return null;
                }
            }

            let error;
            error = validateField(nameInput, 'Vui lòng nhập tên của bạn.');
            if (error) { allValid = false; errorMessages.push(error); }

            error = validateField(phoneInput, 'Vui lòng nhập số điện thoại hợp lệ (10 hoặc 11 chữ số).');
            if (error) { allValid = false; errorMessages.push(error); }
            
            error = validateField(messageInput, 'Vui lòng nhập nội dung phản hồi.');
            if (error) { allValid = false; errorMessages.push(error); }

            if (!allValid) {
                showCustomAlert('Vui lòng sửa các lỗi sau để gửi phản hồi:\n' + errorMessages.join('\n'));
            } else {
                showCustomAlert('Form đã được gửi thành công! Cảm ơn phản hồi của bạn.');
                console.log('Form data:', {
                    name: nameInput.value,
                    phone: phoneInput.value,
                    message: messageInput.value
                });
                feedbackForm.reset(); 
            }
        });
    }

  
    function showCustomAlert(message) {
        let customAlert = document.getElementById('customAlert');
        let customAlertMessage = document.getElementById('customAlertMessage');

        if (!customAlert) { 
            customAlert = document.createElement('div');
            customAlert.id = 'customAlert';
            customAlert.style.cssText = `
                display: none;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border: 1px solid #ccc;
                z-index: 10000;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                max-width: 350px;
                text-align: center;
            `;
            customAlertMessage = document.createElement('p');
            customAlertMessage.id = 'customAlertMessage';
            customAlert.appendChild(customAlertMessage);

            const okButton = document.createElement('button');
            okButton.textContent = 'OK';
            okButton.style.cssText = `
                margin-top: 15px;
                padding: 8px 15px;
                background: #E67E22;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            `;
            okButton.onclick = function() {
                customAlert.style.display = 'none';
            };
            customAlert.appendChild(okButton);
            document.body.appendChild(customAlert);
        }
        customAlertMessage.textContent = message;
        customAlert.style.display = 'block';
    }

    
    document.querySelectorAll('.scroll-to-element, a[href^="#"]').forEach(anchor => {
        
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
           
            if (href === '#') {
                e.preventDefault(); 
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight + 20 : 0;
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
            
        });
    });

   
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            
           
            faqQuestions.forEach(otherQuestion => {
                const otherAnswer = otherQuestion.nextElementSibling;
                if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.classList.remove('active');
                }
            });

            
            question.classList.toggle('active');
            if (answer.classList.contains('active')) { 
                answer.style.maxHeight = '0';
                answer.classList.remove('active');
            } else { 
                answer.classList.add('active');
                
                answer.offsetHeight; 
                answer.style.maxHeight = answer.scrollHeight + 'px';

                
                const questionRect = question.getBoundingClientRect();
                const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                const isQuestionOutOfView = questionRect.bottom > viewportHeight || questionRect.top < 0;

                if (isQuestionOutOfView) {
                    setTimeout(() => {
                        const offset = navbar ? navbar.offsetHeight + 20 : 0;
                        const topPosition = window.pageYOffset + question.getBoundingClientRect().top - offset;
                        
                        window.scrollTo({
                            top: topPosition,
                            behavior: 'smooth'
                        });
                    }, 300); 
                }
            }
        });
    });

    
    window.addEventListener('resize', adjustPagePadding);
    
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    scrollRevealElements.forEach(element => {
        observer.observe(element);
    });

   
    scrollRevealElements.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight) {
            element.classList.add('revealed');
        }
    });
    
const nav = document.getElementById('mainNavbar');
const navLogo = document.getElementById('navbarLogo');
const pageContentWrapper = document.querySelector('.page-content-wrapper');


let initialNavPaddingTopBottom = 10; 
let initialNavPaddingLeftRight = 40; 
let initialLogoHeight = 50; 


if (navLogo) {
    initialLogoHeight = navLogo.offsetHeight || 50;
}


if (nav) {
    const computedStyle = window.getComputedStyle(nav);
    const paddingValues = computedStyle.padding.split(" ");
    if (paddingValues.length === 1) {
        initialNavPaddingTopBottom = parseFloat(paddingValues[0]);
    }
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



});