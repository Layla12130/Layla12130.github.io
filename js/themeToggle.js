export function initThemeToggle() {
  const button = document.getElementById("theme-toggle");
  button.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
    button.textContent = document.body.classList.contains("dark") ? "🌙" : "☀️";
  });
}

