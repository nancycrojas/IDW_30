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