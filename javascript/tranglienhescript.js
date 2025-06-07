document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('mainNavbar');
    const navbarLogo = document.getElementById('navbarLogo');
    // const pageContainer = document.querySelector('.page-container'); // Không có .page-container trong HTML
    let defaultPaddingTopBottom = 15;
    let defaultLogoHeight = 70;

    // Lấy giá trị padding mặc định của navbar
    if (navbar) {
        const computedStyle = window.getComputedStyle(navbar);
        const paddingValues = computedStyle.padding.split(" ");
        if (paddingValues.length === 1) {
            defaultPaddingTopBottom = parseFloat(paddingValues[0]);
        } else if (paddingValues.length >= 2) {
            defaultPaddingTopBottom = parseFloat(paddingValues[0]);
        }
    }
    // Lấy chiều cao mặc định của logo
    if (navbarLogo) {
        defaultLogoHeight = navbarLogo.offsetHeight || 70;
    }

    // Điều chỉnh padding-top của body để tránh nội dung bị che bởi navbar cố định
    function adjustPagePadding() {
        if (navbar) {
            // Sử dụng document.body vì không có .page-container trong HTML
            document.body.style.paddingTop = navbar.offsetHeight + 'px';
        }
    }
    adjustPagePadding();

    // Xử lý thay đổi navbar khi cuộn trang
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
        adjustPagePadding(); // Điều chỉnh lại padding khi navbar thay đổi kích thước
    });

    // Xử lý hiệu ứng cuộn mượt (scroll reveal) cho các section
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

    // Xử lý form phản hồi (feedback form)
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Ngăn chặn gửi form mặc định
            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
            // emailInput và subjectInput không có trong HTML của trang liên hệ, nên bỏ qua validation
            const messageInput = document.getElementById('message');

            let allValid = true;
            let errorMessages = [];

            // Hàm kiểm tra và validate từng trường
            function validateField(inputElement, errorMessage) {
                let currentErrorMessage = null;
                if (!inputElement.value.trim()) {
                    currentErrorMessage = errorMessage;
                } else if (inputElement.checkValidity && !inputElement.checkValidity()) {
                    currentErrorMessage = inputElement.title || 'Giá trị không hợp lệ.';
                }

                // Logic validation riêng cho số điện thoại
                if (inputElement.id === 'phone') {
                    const phoneRegex = /^(0|84)(3|5|7|8|9)\d{8}$/; // Regex cho SĐT Việt Nam
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
                feedbackForm.reset(); // Reset form sau khi gửi thành công
            }
        });
    }

    // Hàm hiển thị alert tùy chỉnh
    function showCustomAlert(message) {
        let customAlert = document.getElementById('customAlert');
        let customAlertMessage = document.getElementById('customAlertMessage');

        if (!customAlert) { // Nếu alert chưa tồn tại, tạo mới
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

    // Xử lý cuộn mượt cho các thẻ <a> có href bắt đầu bằng '#' hoặc có class .scroll-to-element
    document.querySelectorAll('.scroll-to-element, a[href^="#"]').forEach(anchor => {
        
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Kiểm tra nếu href chỉ là "#" thì bỏ qua hành vi mặc định
            if (href === '#') {
                e.preventDefault(); 
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight + 20 : 0; // Thêm 20px để có khoảng cách
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
            // Không cần đóng overlay tìm kiếm vì nó đã bị loại bỏ
        });
    });

    // Xử lý các câu hỏi thường gặp (FAQ) - Mở/Đóng và Cuộn trang
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            
            // Đóng các câu hỏi khác
            faqQuestions.forEach(otherQuestion => {
                const otherAnswer = otherQuestion.nextElementSibling;
                if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.classList.remove('active');
                }
            });

            // Mở/đóng câu hỏi được nhấp vào
            question.classList.toggle('active');
            if (answer.classList.contains('active')) { // Nếu đang mở, đóng lại
                answer.style.maxHeight = '0';
                answer.classList.remove('active');
            } else { // Nếu đang đóng, mở ra
                answer.classList.add('active');
                // Đảm bảo trình duyệt tính toán đúng chiều cao
                answer.offsetHeight; 
                answer.style.maxHeight = answer.scrollHeight + 'px';

                // Logic cuộn trang: chỉ cuộn khi câu hỏi nằm ngoài tầm nhìn
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

    // Điều chỉnh padding khi thay đổi kích thước cửa sổ
    window.addEventListener('resize', adjustPagePadding);
    // Scroll reveal cho Map Section và các phần tử có class scroll-reveal
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Khi 10% phần tử hiển thị trong viewport
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Ngừng theo dõi sau khi đã reveal
            }
        });
    }, observerOptions);

    scrollRevealElements.forEach(element => {
        observer.observe(element);
    });

    // Xử lý để đảm bảo map hiển thị ngay nếu nó đã ở trong viewport khi tải trang
    scrollRevealElements.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight) {
            element.classList.add('revealed');
        }
    });
});