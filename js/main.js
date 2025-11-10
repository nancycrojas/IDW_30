document.addEventListener("DOMContentLoaded", () => {
  const linkLogin = document.getElementById("linkLogin");
  const btnLogout = document.getElementById("btnLogout");
  const itemAltaMedico = document.getElementById("itemAltaMedico");
  const saludoUsuario = document.getElementById("saludoUsuario");

  const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");
  const token = sessionStorage.getItem("token");

  const isLoginPage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname.endsWith("/") ||
    window.location.pathname.endsWith("login.html");

  if (!usuarioLogueado || !token) {
    if (!isLoginPage) {
      sessionStorage.clear();
      window.location.href = "index.html";
    }
    return;
  }

  const nombreCap =
    usuarioLogueado.charAt(0).toUpperCase() +
    usuarioLogueado.slice(1).toLowerCase();

  if (linkLogin) {
    linkLogin.textContent = `👋 ${nombreCap}`;
    linkLogin.removeAttribute("href");
  } else if (saludoUsuario) {
    saludoUsuario.textContent = `👋 ${nombreCap}`;
  }

  btnLogout?.classList.remove("d-none");
  itemAltaMedico?.classList.remove("d-none");

  btnLogout?.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "index.html";
  });
});
