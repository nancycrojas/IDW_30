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

// Manejar login/logout en el menú de navegación
document.addEventListener("DOMContentLoaded", () => {
  const linkLogin = document.getElementById("linkLogin");
  const btnLogout = document.getElementById("btnLogout");
  const itemAltaMedico = document.getElementById("itemAltaMedico");
  const itemTurnos = document.getElementById("itemTurnos");

  const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");

  // Si hay usuario logueado, actualizar el menú
  if (usuarioLogueado) {
    const nombreCap =
      usuarioLogueado.charAt(0).toUpperCase() +
      usuarioLogueado.slice(1).toLowerCase();

    // Actualizar el texto del enlace de login
    if (linkLogin) {
      linkLogin.textContent = `👋 Bienvenido/a ${nombreCap}`;
      linkLogin.removeAttribute("href");
    }

    // Mostrar botón de logout
    if (btnLogout) {
      btnLogout.classList.remove("d-none");
    }

    // Mostrar menús administrativos
    itemAltaMedico?.classList.remove("d-none");
    itemTurnos?.classList.remove("d-none");

    // Manejar logout
    btnLogout?.addEventListener("click", () => {
      sessionStorage.removeItem("usuarioLogueado");
      window.location.href = "index.html";
    });
  }
});