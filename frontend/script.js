const API_URL = "http://localhost:5000/api";
let userId = null;
let cart = [];

// Переключение секций
function showSection(section) {
    document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(section).classList.remove("hidden");
}

// Регистрация
async function register() {
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    document.getElementById("register-message").innerText = data.message;
}

// Вход
async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.userId) {
        userId = data.userId;
        document.getElementById("login-message").innerText = "Успешный вход!";
    } else {
        document.getElementById("login-message").innerText = "Ошибка входа.";
    }
}

// Загрузка товаров
async function loadProducts() {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();

    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
            <h3>${product.name}</h3>
            <p>Цена: ${product.price} $</p>
            <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Добавить в корзину</button>
        `;
        productList.appendChild(div);
    });
}

// Добавить в корзину
function addToCart(productId, name, price) {
    cart.push({ productId, name, price, quantity: 1 });
    document.getElementById("cart-count").innerText = cart.length;
}

// Оформить заказ
async function placeOrder() {
    if (!userId) {
        alert("Сначала войдите в аккаунт!");
        return;
    }

    const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items: cart })
    });

    const data = await response.json();
    alert(data.message);
    cart = [];
    document.getElementById("cart-count").innerText = 0;
}

// Загрузка заказов
async function loadOrders() {
    if (!userId) {
        alert("Сначала войдите в аккаунт!");
        return;
    }

    const response = await fetch(`${API_URL}/orders/${userId}`);
    const orders = await response.json();

    const orderList = document.getElementById("order-list");
    orderList.innerHTML = orders.map(order => `
        <div>
            <p>Заказ #${order._id} - Сумма: ${order.totalAmount} $</p>
        </div>
    `).join("");
}

// Загрузка товаров при загрузке страницы
document.addEventListener("DOMContentLoaded", loadProducts);