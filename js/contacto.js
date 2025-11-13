const KEY_TURNOS = "turnos";
const KEY_MEDICOS = "medicos";
const KEY_OBRAS_SOCIALES = "obrasSociales";

function cargarMedicos() {
  const raw = localStorage.getItem(KEY_MEDICOS);
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    } catch {}
  }
  return Array.isArray(window.medicos) ? window.medicos : [];
}

function cargarTurnos() {
  const raw = localStorage.getItem(KEY_TURNOS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function cargarObrasSociales() {
  const select = document.getElementById("obraSocial");
  if (!select) return;

  const obrasSociales =
    JSON.parse(localStorage.getItem(KEY_OBRAS_SOCIALES)) || [];

  if (obrasSociales.length === 0) {
    select.innerHTML = `
      <option value="particular" selected>Particular / No tengo</option>
    `;
    return;
  }

  select.innerHTML =
    '<option value="particular" selected>Particular / No tengo</option>' +
    obrasSociales
      .filter((os) => os.estado === "Activa")
      .map(
        (os) =>
          `<option value="${os.nombre}">${os.nombre} - ${os.plan}</option>`
      )
      .join("");
}

function guardarTurno(turno) {
  const turnos = cargarTurnos();
  turnos.push(turno);
  localStorage.setItem(KEY_TURNOS, JSON.stringify(turnos));
}

function cargarOpcionesMedicos() {
  const select = document.getElementById("medico");
  if (!select) return;

  const medicosDisponibles = cargarMedicos();

  if (medicosDisponibles.length === 0) {
    select.innerHTML = '<option value="">No hay médicos disponibles</option>';
    return;
  }

  select.innerHTML =
    '<option value="">Seleccione un médico</option>' +
    medicosDisponibles
      .map(
        (m) =>
          `<option value="${m.id}" data-nombre="${m.apellido}, ${m.nombre}" data-especialidad="${m.especialidad}">Dr/a. ${m.apellido}, ${m.nombre} - ${m.especialidad}</option>`
      )
      .join("");
}

document.getElementById("medico")?.addEventListener("change", (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const especialidad = selectedOption.getAttribute("data-especialidad");
  document.getElementById("especialidad").value = especialidad || "";
});

const fechaInput = document.getElementById("fecha");
if (fechaInput) {
  const hoy = new Date().toISOString().split("T")[0];
  fechaInput.setAttribute("min", hoy);
  fechaInput.value = hoy;
}

const formulario = document.getElementById("formularioTurno");
const alertaExito = document.getElementById("mensajeExito");
const alertaError = document.getElementById("mensajeError");

formulario?.addEventListener("submit", function (event) {
  event.preventDefault();

  alertaExito.classList.add("d-none");
  alertaError.classList.add("d-none");

  if (!formulario.checkValidity()) {
    alertaError.classList.remove("d-none");
    formulario.classList.add("was-validated");
    return;
  }

  const medicoSelect = document.getElementById("medico");
  const medicoOption = medicoSelect.options[medicoSelect.selectedIndex];
  const medicoId = medicoSelect.value;
  const medicoNombre = medicoOption.getAttribute("data-nombre");
  const especialidad = medicoOption.getAttribute("data-especialidad");

  const nuevoTurno = {
    id: Date.now().toString(),
    paciente: {
      nombre: document.getElementById("nombre").value.trim(),
      dni: document.getElementById("dni").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      email: document.getElementById("email").value.trim(),
    },
    medicoId: medicoId,
    medicoNombre: medicoNombre,
    especialidad: especialidad,
    fecha: document.getElementById("fecha").value,
    hora: document.getElementById("hora").value,
    obraSocial: document.getElementById("obraSocial").value,
    estado: "pendiente",
    motivo: document.getElementById("motivo").value.trim(),
  };

  guardarTurno(nuevoTurno);

  alertaExito.classList.remove("d-none");
  formulario.reset();
  formulario.classList.remove("was-validated");

  if (fechaInput) {
    const hoy = new Date().toISOString().split("T")[0];
    fechaInput.value = hoy;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  setTimeout(() => {
    alertaExito.classList.add("d-none");
  }, 8000);
});

document.addEventListener("DOMContentLoaded", () => {
  cargarOpcionesMedicos();
  cargarObrasSociales();
});
