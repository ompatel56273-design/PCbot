document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", e => {
    const href = link.getAttribute("href");
    if (!href.includes(".html")) return;

    e.preventDefault();
    document.querySelector(".auth-box").classList.add("slide-out");

    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
});
