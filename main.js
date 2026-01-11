// ✨ 夢幻美妝商品資料庫
const products = [
    {
        id: 1,
        name: "玫瑰絲絨唇膏",
        desc: "如花瓣般的柔霧質感，顯白必備",
        price: 850,
        img: "玫瑰絲絨唇膏.png"
    },
    {
        id: 2,
        name: "光澤保濕氣墊粉餅",
        desc: "打造韓系水光肌，全天候持妝",
        price: 1200,
        img: "光澤保濕氣墊粉餅.png"
    },
    {
        id: 3,
        name: "星空閃耀眼影盤",
        desc: "九色礦物眼影，各種場合皆適用",
        price: 980,
        img: "星空閃耀眼影盤.png"
    },
    {
        id: 4,
        name: "初戀香水 (50ml)",
        desc: "清新的柑橘與茉莉花香調",
        price: 2500,
        img: "初戀香水 (50ml).png"
    },
    {
        id: 5,
        name: "極致修護精華液",
        desc: "夜間修護，隔日肌膚煥然一新",
        price: 3200,
        img: "極致修護精華液.png"
    }
    ,
    {
        id: 6,
        name: "夢幻星光打亮盤",
        desc: "細緻珠光，打造立體光澤感",
        price: 1050,
        img: "夢幻星光打亮盤.png"
    },
    {
        id: 7,
        name: "柔霧腮紅餅",
        desc: "自然紅潤，持久不脫妝",
        price: 780,
        img: "柔霧腮紅餅.png"
    },
    {
        id: 8,
        name: "水漾保濕唇釉",
        desc: "高保濕不黏膩，雙唇水嫩透亮",
        price: 890,
        img: "水漾保濕唇釉.png"
    },
    {
        id: 9,
        name: "精緻眼線液筆",
        desc: "極細筆尖，輕鬆描繪完美眼線",
        price: 650,
        img: "精緻眼線液筆.png"
    }
];

// 🛍️ 購物車狀態
let cart = JSON.parse(localStorage.getItem('beautyCart')) || {}; // 注意：key 改名避免跟小吃部衝突

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    if (productList) {
        renderProducts();
        updateCartDisplay();
    } else {
        // 如果是結帳頁面
        loadCheckoutPage();
    }
});

// 渲染產品
function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="price">NT$${p.price}</div>
                <button class="add-btn" onclick="addToCart(${p.id})">加入購物袋 👜</button>
            </div>
        </div>
    `).join('');
}

// 加入購物車
function addToCart(id) {
    if (cart[id]) {
        cart[id]++;
    } else {
        cart[id] = 1;
    }
    saveAndRefresh();
}

// 變更數量
function changeQty(id, change) {
    if (cart[id]) {
        cart[id] += change;
        if (cart[id] <= 0) {
            delete cart[id];
        }
    }
    saveAndRefresh();
}

// 儲存與更新
function saveAndRefresh() {
    localStorage.setItem('beautyCart', JSON.stringify(cart));
    updateCartDisplay();
}

// 更新 UI
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    if (!cartItemsDiv) return;

    if (Object.keys(cart).length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-msg">購物袋是空的，快去挑選吧～</p>';
        totalSpan.innerText = 'NT$0';
        return;
    }

    let total = 0;
    let html = '';

    for (let [id, qty] of Object.entries(cart)) {
        const product = products.find(p => p.id == id);
        if (product) {
            total += product.price * qty;
            html += `
                <div class="cart-item">
                    <div>
                        <strong>${product.name}</strong><br>
                        <small>NT$${product.price} x ${qty}</small>
                    </div>
                    <div class="cart-controls">
                        <button onclick="changeQty(${id}, -1)">-</button>
                        <span style="margin:0 8px;">${qty}</span>
                        <button onclick="changeQty(${id}, 1)">+</button>
                    </div>
                </div>
            `;
        }
    }
    cartItemsDiv.innerHTML = html;
    totalSpan.innerText = `NT$${total}`;
}

// 跳轉結帳
function goToCheckout() {
    if (Object.keys(cart).length === 0) {
        alert("妳還沒有挑選商品喔！");
        return;
    }
    window.location.href = "checkout.html";
}

// 結帳頁面邏輯
function loadCheckoutPage() {
    const summaryDiv = document.getElementById('order-summary');
    const finalTotalSpan = document.getElementById('final-total');

    if (!summaryDiv) return;

    let total = 0;
    let html = '<ul style="list-style:none; padding:0;">';
    const currentCart = JSON.parse(localStorage.getItem('beautyCart')) || {};

    for (let [id, qty] of Object.entries(currentCart)) {
        const product = products.find(p => p.id == id);
        if (product) {
            const subtotal = product.price * qty;
            total += subtotal;
            html += `
                <li style="border-bottom:1px dashed #eee; padding:10px 0; display:flex; justify-content:space-between;">
                    <span>${product.name} x ${qty}</span>
                    <span>NT$${subtotal}</span>
                </li>
            `;
        }
    }
    html += '</ul>';

    summaryDiv.innerHTML = html;
    finalTotalSpan.innerText = `NT$${total}`;
}

function confirmOrder() {
    if (confirm("✨ 確定送出訂單嗎？我們將盡快為您寄出商品！")) {
        alert("🎉 訂單已成立！感謝您的購買，祝您這幾天都美美的！");
        localStorage.removeItem('beautyCart');
        window.location.href = "index.html";
    }
}