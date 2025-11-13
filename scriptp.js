// product-script.js - shared javascript for all pages

document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle
  const toggle = document.getElementById("theme-toggle");
  const body = document.body;
  if (!toggle) return;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    toggle.textContent = "☀️";
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const dark = body.classList.contains("dark-mode");
    toggle.textContent = dark ? "☀️" : "🌙";
    localStorage.setItem("theme", dark ? "dark" : "light");
  });

  // Delegated click handlers for add-to-cart / buy-now (alerts demo)
  document.body.addEventListener("click", (e) => {
    if (e.target.matches(".add-cart")) {
      const title = findProductTitle(e.target);
      alert(`🛒 ${title} added to cart (demo).`);
    }
    if (e.target.matches(".buy-now")) {
      const title = findProductTitle(e.target);
      alert(`💳 Proceeding to checkout for ${title} (demo).`);
    }
  });

  function findProductTitle(el) {
    // walk up to product-info or product-card to find the <h1> or <h3>
    let node = el;
    while (node && node !== document.body) {
      const h1 = node.querySelector && node.querySelector("h1");
      if (h1) return h1.textContent.trim();
      const h3 = node.querySelector && node.querySelector("h3");
      if (h3) return h3.textContent.trim();
      node = node.parentElement;
    }
    return "Product";
  }
});
