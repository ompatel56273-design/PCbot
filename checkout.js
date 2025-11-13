document.addEventListener("DOMContentLoaded", () => {
  const orderSummaryEl = document.getElementById("order-summary");
  const checkoutTotalEl = document.getElementById("checkout-total");
  const placeOrderBtn = document.getElementById("place-order-btn");
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const cardDetails = document.getElementById("card-details");
  const upiDetails = document.getElementById("upi-details");
  const addressForm = document.getElementById("address-form");

  // ===================== LOAD CART ITEMS FROM LOCAL STORAGE =====================
  let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

  function renderOrderSummary() {
    orderSummaryEl.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      orderSummaryEl.innerHTML = "<p>Your cart is empty. <a href='index.html'>Go shopping</a>.</p>";
      checkoutTotalEl.textContent = "0";
      placeOrderBtn.disabled = true;
      return;
    }

    cart.forEach(item => {
      const itemRow = document.createElement("div");
      itemRow.classList.add("summary-item");
      itemRow.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="summary-details">
          <p>${item.name}</p>
          <span>₹${item.price.toLocaleString()} × ${item.qty}</span>
        </div>
      `;
      orderSummaryEl.appendChild(itemRow);
      total += item.price * item.qty;
    });

    checkoutTotalEl.textContent = total.toLocaleString();
  }

  renderOrderSummary();

  // ===================== PAYMENT METHOD SWITCH =====================
  paymentRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      const value = radio.value;
      cardDetails.classList.add("hidden");
      upiDetails.classList.add("hidden");

      if (value === "card") cardDetails.classList.remove("hidden");
      if (value === "upi") upiDetails.classList.remove("hidden");
    });
  });

  // ===================== VALIDATION =====================
  function validateForm() {
    const name = document.getElementById("fullname").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

    if (!name || !mobile || !address || !city || !pincode) {
      alert("⚠️ Please fill all required address fields.");
      return false;
    }

    if (selectedPayment === "card") {
      const cardNumber = document.getElementById("card-number").value.trim();
      const expiry = document.getElementById("expiry").value.trim();
      const cvv = document.getElementById("cvv").value.trim();
      if (!cardNumber || !expiry || !cvv) {
        alert("⚠️ Please fill all card details.");
        return false;
      }
    }

    if (selectedPayment === "upi") {
      const upiId = document.getElementById("upi-id").value.trim();
      if (!upiId.includes("@")) {
        alert("⚠️ Enter a valid UPI ID.");
        return false;
      }
    }

    return true;
  }

  // ===================== PLACE ORDER =====================
  placeOrderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const totalAmount = checkoutTotalEl.textContent;

    // Clear cart
    localStorage.removeItem("cartItems");

    // Replace main content with order confirmation
    document.querySelector(".checkout-container").innerHTML = `
      <div class="order-success">
        <h1>✅ Order Placed Successfully!</h1>
        <p>Thank you for shopping with <strong>Gaming CPU Store</strong>.</p>
        <p>Your total payment of <strong>₹${totalAmount}</strong> has been confirmed.</p>
        <div class="delivery-box">
          <p>📦 Estimated Delivery: <strong>${getDeliveryDate()}</strong></p>
        </div>
        <button class="primary-btn" onclick="window.location.href='index.html'">
          Continue Shopping
        </button>
      </div>
    `;

    window.scrollTo(0, 0);
  });

  function getDeliveryDate() {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toDateString().replace(/^\S+\s/, '');
  }
});
