// Contents of script.js

let cart = []; // Mảng để lưu trữ các sản phẩm trong giỏ hàng

/**
 * Định dạng số thành tiền tệ Việt Nam.
 * @param {number} amount - Số tiền cần định dạng.
 * @returns {string} - Chuỗi tiền tệ đã định dạng.
 */
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
}

/**
 * Thêm một sản phẩm vào giỏ hàng hoặc cập nhật số lượng nếu đã tồn tại.
 * @param {string} id - ID duy nhất của sản phẩm.
 * @param {string} name - Tên sản phẩm.
 * @param {number} price - Giá sản phẩm.
 * @param {number} [quantity=1] - Số lượng cần thêm.
 */
function addItemToCart(id, name, price, quantity = 1) {
    const existingItemIndex = cart.findIndex(item => item.id === id);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ id, name, price, quantity });
    }
}

/**
 * Hiển thị các sản phẩm trong giỏ hàng và tổng tiền ra HTML.
 */
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
    const grandTotal = subtotal; // Giả sử miễn phí vận chuyển
    cartGrandTotalElement.textContent = formatCurrency(grandTotal);
}

/**
 * Thêm các sản phẩm khởi tạo vào giỏ hàng và hiển thị chúng.
 */
function addInitialItemsToCart() {
    addItemToCart("combo-cong-chua", "Combo Công chúa", 120000, 1);
    addItemToCart("tra-quat", "Trà quất", 20000, 1);
    renderCartSummary(); // Cập nhật giao diện giỏ hàng
}

// --- Chạy mã chính khi DOM đã sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Thêm các sản phẩm ban đầu vào giỏ hàng và hiển thị
    addInitialItemsToCart();

    // 2. Thiết lập logic cho nút "Xác Nhận Đặt Hàng"
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

            // Kiểm tra giỏ hàng có trống không
            if (cart.length === 0) {
                alert("Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng!");
                return;
            }

            // Kiểm tra các trường thông tin bắt buộc
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

            // Kiểm tra định dạng số điện thoại đơn giản
            if (!/^(0\d{9})$/.test(customerPhone)) {
                alert("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại (phải là 10 số, bắt đầu bằng 0).");
                if (customerPhoneInput) customerPhoneInput.style.borderColor = 'red';
                return;
            } else {
                if (customerPhoneInput) customerPhoneInput.style.borderColor = '#ddd';
            }

            // Nếu tất cả kiểm tra đều qua
            if (successAlertElement) {
                successAlertElement.classList.add('visible');
            } else {
                // Fallback nếu không tìm thấy #custom-success-alert
                alert("Đơn hàng của bạn đã được ghi nhận (lỗi hiển thị thông báo tùy chỉnh)");
            }

            // Chuyển trang sau một khoảng thời gian ngắn
            setTimeout(() => {
                if (successAlertElement) {
                     successAlertElement.classList.remove('visible'); // Ẩn thông báo trước khi chuyển trang
                }
                window.location.href = '../ThucDon.html';
            }, 2500); // Đợi 2.5 giây
        });
    }

    // Reset màu viền nếu người dùng bắt đầu nhập lại
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