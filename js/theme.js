const btn = document.getElementById("btnTheme");
const html = document.documentElement;
const KEY = "theme";

if (btn) {
  function applyTheme(theme) {
    html.setAttribute("data-bs-theme", theme);
    const isDark = theme === "dark";
    btn.innerHTML = isDark ? "⚪️" : "⚫️";
    btn.classList.toggle("btn-outline-dark", !isDark);
    btn.classList.toggle("btn-outline-light", isDark);
  }

  const stored = localStorage.getItem(KEY);
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialTheme = stored || (prefersDark ? "dark" : "light");
  applyTheme(initialTheme);

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const next =
      html.getAttribute("data-bs-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(KEY, next);
  });
}
