//version 1.1.2

let cart = [];
let total = 0;
let products = []; 


async function loadProducts() {
  try {
    const response = await fetch("https://bitter-disk-2029.romi-modukuri.workers.dev/");
    products = await response.json();
    renderProducts(); 
  } catch (err) {
    console.error("Error loading products:", err);
    alert("Failed to load products.");
  }
}


function renderProducts() {
  const container = document.getElementById("products-container");
  container.innerHTML = ""; 
  products.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="product-content">
        <h3>${p.name}</h3>
        <p>$${p.price.toFixed(2)}</p>
        <button onclick="addToCart('${p.name}', ${p.price})">Add to Cart</button>
      </div>
    `;
    container.appendChild(div);
  });
}


function showShop() {
  const homepage = document.getElementById("homepage");
  const shop = document.getElementById("shop");
  homepage.style.opacity = 0;
  setTimeout(() => {
    homepage.style.display = "none";
    shop.style.display = "block";
    shop.style.opacity = 1;
  }, 400);
}


document.getElementById("home-button").addEventListener("click", () => {
  const shop = document.getElementById("shop");
  const homepage = document.getElementById("homepage");
  shop.style.opacity = 0;
  setTimeout(() => {
    shop.style.display = "none";
    homepage.style.display = "flex";
    homepage.style.opacity = 1;
  }, 400);
});


const cartButton = document.getElementById("cart-button");
const checkout = document.getElementById("checkout");
const closeCart = document.getElementById("close-cart");

cartButton.addEventListener("click", () => { updateCartUI(); checkout.classList.add("active"); });
closeCart.addEventListener("click", () => { checkout.classList.remove("active"); });


function addToCart(name, price) {
  let item = cart.find(i => i.name === name);
  if (item) { item.quantity++; } else { cart.push({ name, price, quantity: 1 }); }
  updateCartUI();
}

function updateCartUI() {
  document.getElementById("cart-count").innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
  const ul = document.getElementById("cart-items");
  ul.innerHTML = "";
  total = 0;
  cart.forEach((item, i) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.quantity} x ${item.name} - $${(item.price * item.quantity).toFixed(2)}</span>
      <div class="qty-buttons">
        <button onclick="decreaseQty(${i})">−</button>
        <button onclick="increaseQty(${i})">+</button>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>`;
    ul.appendChild(li);
  });
  document.getElementById("final-total").innerText = total.toFixed(2);
}

function increaseQty(i) { cart[i].quantity++; updateCartUI(); }
function decreaseQty(i) { if (cart[i].quantity > 1) { cart[i].quantity--; } else { cart.splice(i, 1); } updateCartUI(); }
function removeFromCart(i) { cart.splice(i, 1); updateCartUI(); }


function submitOrder(e) {
  e.preventDefault();

  const name = document.getElementById("customer-name").value;
  const email = document.getElementById("customer-email").value;
  const hole = document.getElementById("hole-number").value;
  const payment = document.getElementById("payment-method").value;

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const items = cart.map(i => `${i.quantity} x ${i.name} - $${(i.price * i.quantity).toFixed(2)}`).join(", ");

  const orderData = {
    name: name,
    email: email,
    hole: hole,
    payment: payment,
    items: items,
    total: total.toFixed(2),
    timestamp: new Date().toISOString()
  };

  const WEB_APP_URL = "https://bitter-disk-2029.romi-modukuri.workers.dev/"; 

  fetch(WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  })
    .then(() => {
      alert("Order sent successfully!");
      cart = [];
      total = 0;
      updateCartUI();
      checkout.classList.remove("active");
      document.getElementById("checkout-form").reset();
    })
    .catch(err => {
      console.error(err);
      alert("Error sending order. Check console.");
    });
}


document.getElementById("about-button").addEventListener("click", () => openOverlay("about-overlay"));
document.getElementById("contact-button").addEventListener("click", () => openOverlay("contact-overlay"));
document.querySelectorAll(".close-overlay").forEach(btn => {
  btn.addEventListener("click", () => closeOverlay(btn.dataset.close + "-overlay"));
});

function openOverlay(id) { document.getElementById(id).classList.add("active"); }
function closeOverlay(id) { document.getElementById(id).classList.remove("active"); }


loadProducts();
