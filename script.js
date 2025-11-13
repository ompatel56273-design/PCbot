document.addEventListener("DOMContentLoaded", () => {
  // ===== CATEGORY FILTER =====
  const categoryLinks = document.querySelectorAll('.category-nav a');
  const productCards = document.querySelectorAll('.product-card');

  categoryLinks.forEach(link => {
    link.addEventListener('click', () => {
      const category = link.dataset.category;
      productCards.forEach(card => {
        card.style.display = category === 'all' || card.dataset.category === category ? 'block' : 'none';
      });
    });
  });

  // ===== CART LOGIC =====
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const cartToggle = document.getElementById("cart-toggle");
  const closeCartBtn = document.getElementById("close-cart");
  const themeToggleBtn = document.getElementById("theme-toggle");

  let cart = [];

  // Cart toggle
  cartToggle.addEventListener("click", () => cartSidebar.classList.add("show"));
  closeCartBtn.addEventListener("click", () => cartSidebar.classList.remove("show"));

  // Add to Cart
  const addCartButtons = document.querySelectorAll('.add-to-cart, .add-cart');
  addCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest(".product-card");
      const name = card.querySelector("h3").textContent;
      const price = parseInt(card.querySelector(".price").textContent.replace(/₹|,/g,""));
      const imgSrc = card.querySelector("img").src;

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) existingItem.qty += 1;
      else cart.push({ name, price, imgSrc, qty: 1 });

      updateCart();
    });
  });

  // Buy Now
  const buyNowButtons = document.querySelectorAll('.buy-now');
  buyNowButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest(".product-card");
      const name = card.querySelector("h3").textContent;
      const price = card.querySelector(".price").textContent;
      alert(`Proceed to buy ${name} for ${price}!`);
    });
  });

  // Update Cart UI
  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      total += item.price * item.qty;

      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
        <img src="${item.imgSrc}" alt="${item.name}" />
        <div class="cart-item-details">
          <strong>${item.name}</strong>
          <p>₹${item.price.toLocaleString()} x <span class="qty">${item.qty}</span></p>
          <div class="qty-buttons">
            <button class="decrease">-</button>
            <button class="increase">+</button>
          </div>
        </div>
        <button class="remove-item">✖</button>
      `;
      cartItemsContainer.appendChild(itemEl);

      itemEl.querySelector(".increase").addEventListener("click", () => { item.qty += 1; updateCart(); });
      itemEl.querySelector(".decrease").addEventListener("click", () => { 
        item.qty > 1 ? item.qty -= 1 : cart = cart.filter(i => i.name !== item.name);
        updateCart();
      });
      itemEl.querySelector(".remove-item").addEventListener("click", () => {
        cart = cart.filter(i => i.name !== item.name);
        updateCart();
      });
    });

    cartTotalEl.textContent = total.toLocaleString();
  }

  // Checkout
  checkoutBtn.addEventListener("click", () => {
    if(cart.length === 0) alert("Your cart is empty!");
    else {
      alert(`Checkout - Total: ₹${cart.reduce((sum,i)=>sum+i.price*i.qty,0).toLocaleString()}`);
      cart = [];
      updateCart();
      cartSidebar.classList.remove("show");
    }
  });

  // Theme toggle
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    cartSidebar.classList.toggle("dark-mode");
    themeToggleBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  });
});
// ======== DARK MODE TOGGLE ========
const themeToggle = document.querySelector(".theme-toggle");
themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // Save preference
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// Load saved theme on refresh
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark");
});

// ======== CART SIDEBAR TOGGLE ========
const cartToggle = document.querySelector(".cart-toggle");
const cartSidebar = document.querySelector(".cart-sidebar");

cartToggle?.addEventListener("click", () => {
  cartSidebar.classList.toggle("show");
});



// ======== ADD TO CART LOGIC ========
let cartItems = [];

function updateCartDisplay() {
  const cartContainer = document.querySelector(".cart-items");
  cartContainer.innerHTML = "";

  let total = 0;

  cartItems.forEach((item, index) => {
    total += item.price * item.qty;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-details">
        <strong>${item.name}</strong>
        <span class="price">₹${item.price}</span>
        <div class="qty-buttons">
          <button class="decrease">-</button>
          <span>${item.qty}</span>
          <button class="increase">+</button>
        </div>
      </div>
    `;
    cartContainer.appendChild(cartItem);

    // Increase / Decrease quantity
    cartItem.querySelector(".increase").addEventListener("click", () => {
      item.qty++;
      updateCartDisplay();
    });
    cartItem.querySelector(".decrease").addEventListener("click", () => {
      if (item.qty > 1) {
        item.qty--;
      } else {
        cartItems.splice(index, 1);
      }
      updateCartDisplay();
    });
  });

  // Update total
  document.querySelector(".cart-footer span").textContent = `₹${total.toFixed(2)}`;
}

// Attach Add to Cart buttons
document.querySelectorAll(".add-cart").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    const name = productCard.querySelector("h3").textContent;
    const price = parseFloat(
      productCard.querySelector(".price").textContent.replace(/[^\d.]/g, "")
    );
    const img = productCard.querySelector("img").src;

    const existingItem = cartItems.find((i) => i.name === name);
    if (existingItem) {
      existingItem.qty++;
    } else {
      cartItems.push({ name, price, img, qty: 1 });
    }

    updateCartDisplay();
    cartSidebar.classList.add("show"); // auto-open cart when added
  });
});

// Checkout Button Action
document.querySelector(".checkout-btn")?.addEventListener("click", () => {
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("✅ Checkout successful! (This can link to your payment page)");
  cartItems = [];
  updateCartDisplay();
  cartSidebar.classList.remove("show");
});

const API_KEY = "YOUR_OPENAI_KEY"; // ← Add your key here

const chatBtn = document.getElementById("chatBtn");
const chatbot = document.getElementById("chatbot");
const closeChat = document.getElementById("closeChat");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

// ✅ Open Chat
chatBtn.onclick = () => (chatbot.style.display = "flex");

// ✅ Close Chat
closeChat.onclick = () => (chatbot.style.display = "none");

// ✅ Add Message
function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = type === "user" ? "user-msg" : "bot-msg";
  msg.innerText = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ✅ Typing Animation
function showTyping() {
  const typing = document.createElement("div");
  typing.id = "typing";
  typing.className = "bot-msg";
  typing.innerText = "Typing...";
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}


