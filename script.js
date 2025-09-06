let cart = [];
let total = 0;


const products = [
  {name:"ProSpin Golf Ball", price:2.5, img:"images/ball1.jpg"},
  {name:"Eco Saver Recycled Ball", price:1.25, img:"images/ball2.jpg"},
  {name:"Ultra Distance Ball", price:3, img:"images/ball3.jpg"},
  {name:"Tour Pro X", price:3.5, img:"images/ball4.jpg"},
  {name:"Summer Breeze", price:2.75, img:"images/ball5.jpg"},
  {name:"PowerDrive", price:3.25, img:"images/ball6.jpg"},
  {name:"SpinMaster", price:3, img:"images/ball7.jpg"},
  {name:"GreenLine", price:2.5, img:"images/ball8.jpg"},
  {name:"Velocity", price:3.1, img:"images/ball9.jpg"},
  {name:"Ace Golf", price:2.9, img:"images/ball10.jpg"},
  {name:"Eagle Eye", price:3.3, img:"images/ball11.jpg"},
  {name:"Champion", price:3.4, img:"images/ball12.jpg"},
  {name:"LongDrive", price:3, img:"images/ball13.jpg"},
  {name:"Birdie", price:2.8, img:"images/ball14.jpg"},
  {name:"Hole-in-One", price:3.2, img:"images/ball15.jpg"},
  {name:"ProLine", price:3.1, img:"images/ball16.jpg"},
  {name:"MaxDistance", price:3.3, img:"images/ball17.jpg"},
  {name:"EcoSpin", price:1.9, img:"images/ball18.jpg"},
  {name:"TourBall", price:3.5, img:"images/ball19.jpg"},
  {name:"Elite Golf", price:3.6, img:"images/ball20.jpg"},
  {name:"GreenPro", price:3.2, img:"images/ball21.jpg"},
  {name:"SpeedBall", price:3.1, img:"images/ball22.jpg"},
  {name:"Precision", price:3.3, img:"images/ball23.jpg"},
  {name:"UltraSpin", price:3.4, img:"images/ball24.jpg"},
  {name:"PowerShot", price:3.5, img:"images/ball25.jpg"},
  {name:"AcePro", price:3.2, img:"images/ball26.jpg"},
  {name:"BirdieX", price:3.1, img:"images/ball27.jpg"},
  {name:"ChampionPlus", price:3.6, img:"images/ball28.jpg"},
  {name:"MaxSpin", price:3.3, img:"images/ball29.jpg"},
  {name:"HolePro", price:3.2, img:"images/ball30.jpg"}
];


function showShop(){
  const homepage = document.getElementById("homepage");
  const shop = document.getElementById("shop");
  homepage.style.opacity = 0;
  setTimeout(()=>{
    homepage.style.display = "none";
    shop.style.display = "block";
    shop.style.opacity = 1;
  },400);
}

document.getElementById("home-button").addEventListener("click", ()=>{
  const shop = document.getElementById("shop");
  const homepage = document.getElementById("homepage");
  shop.style.opacity = 0;
  setTimeout(()=>{
    shop.style.display = "none";
    homepage.style.display = "flex";
    homepage.style.opacity = 1;
  },400);
});


const cartButton = document.getElementById("cart-button");
const checkout = document.getElementById("checkout");
const closeCart = document.getElementById("close-cart");

cartButton.addEventListener("click", ()=> { updateCartUI(); checkout.classList.add("active"); });
closeCart.addEventListener("click", ()=> { checkout.classList.remove("active"); });


function renderProducts(){
  const container = document.getElementById("products-container");
  products.forEach((p, index)=>{
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

function addToCart(name, price){
  let item = cart.find(i => i.name === name);
  if(item){ item.quantity++; } else { cart.push({name, price, quantity:1}); }
  updateCartUI();
}

function updateCartUI(){
  document.getElementById("cart-count").innerText = cart.reduce((sum,i)=>sum+i.quantity,0);
  let ul = document.getElementById("cart-items"); 
  ul.innerHTML = "";
  total = 0;
  cart.forEach((item, i)=>{
    total += item.price*item.quantity;
    let li = document.createElement("li");
    li.innerHTML = `<span>${item.quantity} x ${item.name} - $${(item.price*item.quantity).toFixed(2)}</span>
      <div class="qty-buttons">
        <button onclick="decreaseQty(${i})">−</button>
        <button onclick="increaseQty(${i})">+</button>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>`;
    ul.appendChild(li);
  });
  document.getElementById("final-total").innerText = total.toFixed(2);
}

function increaseQty(i){ cart[i].quantity++; updateCartUI(); }
function decreaseQty(i){ if(cart[i].quantity>1){ cart[i].quantity--; } else { cart.splice(i,1); } updateCartUI(); }
function removeFromCart(i){ cart.splice(i,1); updateCartUI(); }


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

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzwiSCRCAtKiX3Euk7YdpdWneq87idK0DdQ_sX2dxvU4KlMezRnYdsUtC2hSViOdemOVw/exec"; 

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


document.getElementById("about-button").addEventListener("click", ()=> openOverlay("about-overlay"));
document.getElementById("contact-button").addEventListener("click", ()=> openOverlay("contact-overlay"));
document.querySelectorAll(".close-overlay").forEach(btn=>{
  btn.addEventListener("click", ()=> closeOverlay(btn.dataset.close + "-overlay"));
});

function openOverlay(id){ document.getElementById(id).classList.add("active"); }
function closeOverlay(id){ document.getElementById(id).classList.remove("active"); }


renderProducts();
