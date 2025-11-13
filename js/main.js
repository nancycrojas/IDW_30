function verificarAutenticacion() {
  if (!sessionStorage.getItem('usuarioLogueado')) {
    window.location.href = 'login.html';
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const linkLogin = document.getElementById("linkLogin");
  const btnLogout = document.getElementById("btnLogout");
  const itemAltaMedico = document.getElementById("itemAltaMedico");
  const itemTurnos = document.getElementById("itemTurnos");
  const itemPanel = document.getElementById("itemPanel");

  const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");

  if (usuarioLogueado) {
    const nombreCap =
      usuarioLogueado.charAt(0).toUpperCase() +
      usuarioLogueado.slice(1).toLowerCase();

    if (linkLogin) {
      linkLogin.textContent = `👋 Bienvenido/a ${nombreCap}`;
      linkLogin.removeAttribute("href");
    }

    if (btnLogout) {
      btnLogout.classList.remove("d-none");
    }

    itemAltaMedico?.classList.remove("d-none");
    itemTurnos?.classList.remove("d-none");
    itemPanel?.classList.remove("d-none");

    btnLogout?.addEventListener("click", () => {
      sessionStorage.removeItem("usuarioLogueado");
      window.location.href = "index.html";
    });
    }
});
