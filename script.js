// ===============================
// 💡 GAMING CPU STORE SCRIPT
// ===============================
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
  const cartToggle = document.getElementById("cart-toggle");
  const closeCartBtn = document.getElementById("close-cart");
  const checkoutBtn = document.getElementById("checkout-btn"); // restored
  const themeToggleBtn = document.getElementById("theme-toggle");

  // Load cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ===== CART SIDEBAR TOGGLE =====
  cartToggle?.addEventListener("click", () => cartSidebar.classList.add("show"));
  closeCartBtn?.addEventListener("click", () => cartSidebar.classList.remove("show"));

  // ===== ADD TO CART =====
  const addCartButtons = document.querySelectorAll('.add-to-cart, .add-cart');
  addCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest(".product-card");
      const name = card.querySelector("h3").textContent;
      const price = parseInt(card.querySelector(".price").textContent.replace(/₹|,/g, ""));
      const imgSrc = card.querySelector("img").src;

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) existingItem.qty += 1;
      else cart.push({ name, price, imgSrc, qty: 1 });

      updateCart();
      saveCart();
      cartSidebar.classList.add("show"); // open sidebar when item added
    });
  });

  // ===== UPDATE CART DISPLAY =====
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

      // === Quantity controls ===
      itemEl.querySelector(".increase").addEventListener("click", () => {
        item.qty += 1;
        updateCart();
        saveCart();
      });

      itemEl.querySelector(".decrease").addEventListener("click", () => {
        item.qty > 1 ? item.qty -= 1 : cart = cart.filter(i => i.name !== item.name);
        updateCart();
        saveCart();
      });

      itemEl.querySelector(".remove-item").addEventListener("click", () => {
        cart = cart.filter(i => i.name !== item.name);
        updateCart();
        saveCart();
      });
    });

    cartTotalEl.textContent = total.toLocaleString();
  }

  // ===== SAVE CART =====
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ===== CHECKOUT =====
  checkoutBtn?.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    // Redirect to checkout page (HTML-only)
    window.location.href = "checkout.html";
  });

  // ===== THEME TOGGLE (KEEPING YOUR STYLE) =====
  themeToggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    cartSidebar?.classList.toggle("dark-mode");
    const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
    themeToggleBtn.textContent = currentTheme === "dark" ? "☀️" : "🌙";
  });

  // ===== APPLY SAVED THEME =====
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    cartSidebar?.classList.add("dark-mode");
    if (themeToggleBtn) themeToggleBtn.textContent = "☀️";
  }

  // ===== INITIALIZE CART DISPLAY =====
  updateCart();
});
