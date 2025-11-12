import { login } from "./auth.js";

const formLogin = document.getElementById("formLogin");
const usuario = document.getElementById("usuario");
const clave = document.getElementById("clave");
const mensaje = document.getElementById("mensaje");

function mostrarMensaje(texto, tipo, mostrarSpinner = false) {
  const spinnerHTML = mostrarSpinner
    ? `<div class="spinner-border spinner-border-sm ms-2" role="status">
         <span class="visually-hidden">Cargando...</span>
       </div>`
    : "";

  mensaje.innerHTML = `
    <div class="col-md-6 col-lg-4 mx-auto mt-3">
      <div class="alert alert-${tipo} text-center d-flex align-items-center justify-content-center" role="alert">
        ${texto} ${spinnerHTML}
      </div>
    </div>
  `;
}

formLogin.addEventListener("submit", async function (event) {
  event.preventDefault();

  const usuarioInput = usuario.value.trim();
  const claveInput = clave.value.trim();

  const isUsuario = await login(usuarioInput, claveInput);

  if (isUsuario) {
    sessionStorage.setItem("usuarioLogueado", isUsuario.username);
    sessionStorage.setItem("token", isUsuario.accessToken);
    mostrarMensaje(
      `Bienvenida/o ${isUsuario.firstName} ${isUsuario.lastName}`,
      "success",
      true
    );

    setTimeout(() => {
      window.location.href = "panel.html";
    }, 2000);
  } else {
    mostrarMensaje("Error en credenciales", "danger");
  }
});
