const pwd = document.getElementById("password");
const bar = document.getElementById("bar");
const text = document.getElementById("strength-text");

pwd.addEventListener("input", () => {
  const val = pwd.value;
  let strength = 0;

  if (val.length > 5) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[@$!%*?&]/.test(val)) strength++;

  if (strength === 0) {
    bar.style.width = "0%";
    text.textContent = "Very Weak";
  } else if (strength === 1) {
    bar.style.width = "25%";
    bar.style.background = "red";
    text.textContent = "Weak";
  } else if (strength === 2) {
    bar.style.width = "50%";
    bar.style.background = "orange";
    text.textContent = "Medium";
  } else if (strength === 3) {
    bar.style.width = "75%";
    bar.style.background = "yellow";
    text.textContent = "Strong";
  } else {
    bar.style.width = "100%";
    bar.style.background = "lime";
    text.textContent = "Very Strong";
  }
});
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
