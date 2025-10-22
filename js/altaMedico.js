const formAltaMedico = document.getElementById("altaMedicoForm");
const inputApellido = document.getElementById("apellido");
const inputNombre = document.getElementById("nombre");
const inputMatricula = document.getElementById("matricula");
const inputEspecialidad = document.getElementById("especialidad");
const inputDescripcion = document.getElementById("descripcion");
const inputTelefono = document.getElementById("telefono");
const inputObraSocial = document.getElementById("obraSocial");
const inputEmail = document.getElementById("email");
const inputValor = document.getElementById("valorConsulta");

function altaMedicos(event) {
  event.preventDefault();

  let apellido = inputApellido.value.trim();
  let nombre = inputNombre.value.trim();
  let matricula = inputMatricula.value.trim();
  let especialidad = inputEspecialidad.value.trim();
  let descripcion = inputDescripcion.value.trim();
  let telefono = inputTelefono.value.trim();
  let obraSocial = inputObraSocial.value.trim();
  let email = inputEmail.value.trim();
  let valorConsulta = inputValor.value.trim();

  if (!nombre || !especialidad || !obraSocial) {
    alert("POr favor completá los campor requeridos");
    return;
  }
  alert(
    `Médico registrado: \n\n` +
      `Apellido: ${apellido}\n` +
      `Nombre: ${nombre}\n` +
      `Matricula: ${matricula}\n` +
      `Especialidad: ${especialidad}\n` +
      `Descripción: ${descripcion}\n` +
      `Teléfono: ${telefono}\n` +
      `Obra Social: ${obraSocial}\n` +
      `Email: ${email}\n` +
      `Valor Consulta: ${valorConsulta}`
  );
  formAltaMedico.reset();
}

formAltaMedico.addEventListener("submit", altaMedicos);

document.addEventListener("DOMContentLoaded", () => {
  let nombre = sessionStorage.getItem("usuarioLogueado") || "";

  if (!nombre) {
    window.location.href = "index.html";
    return;
  }

  const nombreCap =
    nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

  const saludo = document.getElementById("saludoUsuario");
  if (saludo) {
    saludo.textContent = `👋 Bienvenido/a ${nombreCap}`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  let nombre = sessionStorage.getItem("usuarioLogueado") || "";

  if (!nombre) {
    window.location.href = "index.html";
    return;
  }

  const nombreCap =
    nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
  const saludo = document.getElementById("saludoUsuario");

  if (saludo) {
    saludo.textContent = `👋 Bienvenido/a ${nombreCap}`;
  }

  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      sessionStorage.removeItem("usuarioLogueado");
      window.location.href = "index.html";
    });
  }
});
