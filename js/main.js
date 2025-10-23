const btn = document.getElementById("btnTheme");
const html = document.documentElement;
const KEY = "theme";

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

document.addEventListener("DOMContentLoaded", () => {
  const linkLogin = document.getElementById("linkLogin");
  const btnLogout = document.getElementById("btnLogout");
  const itemAltaMedico = document.getElementById("itemAltaMedico");

  const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");

  if (usuarioLogueado) {
    const nombreCap =
      usuarioLogueado.charAt(0).toUpperCase() +
      usuarioLogueado.slice(1).toLowerCase();

    linkLogin.textContent = `👋 Bienvenido/a ${nombreCap}`;
    linkLogin.removeAttribute("href");

    btnLogout.classList.remove("d-none");
    itemAltaMedico?.classList.remove("d-none");

    btnLogout.addEventListener("click", () => {
      sessionStorage.removeItem("usuarioLogueado");
      window.location.reload();
    });
  }
});
