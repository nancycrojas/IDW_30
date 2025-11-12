const KEY_TURNOS = "turnos";
const KEY_MEDICOS = "medicos";

// Cargar médicos desde localStorage
function cargarMedicos() {
  const raw = localStorage.getItem(KEY_MEDICOS);
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    } catch {}
  }
  // Si no hay en localStorage, usar los del archivo medicos.js
  return Array.isArray(window.medicos) ? window.medicos : [];
}

// Cargar turnos existentes
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

// Guardar turno en localStorage
function guardarTurno(turno) {
  const turnos = cargarTurnos();
  turnos.push(turno);
  localStorage.setItem(KEY_TURNOS, JSON.stringify(turnos));
}

// Cargar opciones de médicos en el select
function cargarOpcionesMedicos() {
  const select = document.getElementById("medico");
  if (!select) return;

  const medicosDisponibles = cargarMedicos();
  
  if (medicosDisponibles.length === 0) {
    select.innerHTML = '<option value="">No hay médicos disponibles</option>';
    return;
  }

  select.innerHTML = '<option value="">Seleccione un médico</option>' +
    medicosDisponibles.map(m => 
      `<option value="${m.id}" data-nombre="${m.apellido}, ${m.nombre}" data-especialidad="${m.especialidad}">Dr/a. ${m.apellido}, ${m.nombre} - ${m.especialidad}</option>`
    ).join('');
}

// Manejar cambio de médico (asignar especialidad automáticamente)
document.getElementById("medico")?.addEventListener("change", (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const especialidad = selectedOption.getAttribute("data-especialidad");
  document.getElementById("especialidad").value = especialidad || "";
});

// Establecer fecha mínima como hoy
const fechaInput = document.getElementById("fecha");
if (fechaInput) {
  const hoy = new Date().toISOString().split('T')[0];
  fechaInput.setAttribute("min", hoy);
  fechaInput.value = hoy; // Establecer hoy como valor por defecto
}

// Formulario
const formulario = document.getElementById("formularioTurno");
const alertaExito = document.getElementById("mensajeExito");
const alertaError = document.getElementById("mensajeError");

formulario?.addEventListener("submit", function (event) {
  event.preventDefault();

  // Ocultar alertas anteriores
  alertaExito.classList.add("d-none");
  alertaError.classList.add("d-none");

  // Validación: Si no es válido (faltan campos required)
  if (!formulario.checkValidity()) {
    alertaError.classList.remove("d-none");
    formulario.classList.add("was-validated");
    return;
  }

  // Obtener datos del médico seleccionado
  const medicoSelect = document.getElementById("medico");
  const medicoOption = medicoSelect.options[medicoSelect.selectedIndex];
  const medicoId = medicoSelect.value;
  const medicoNombre = medicoOption.getAttribute("data-nombre");
  const especialidad = medicoOption.getAttribute("data-especialidad");

  // Crear objeto turno
  const nuevoTurno = {
    id: Date.now().toString(),
    paciente: {
      nombre: document.getElementById("nombre").value.trim(),
      dni: document.getElementById("dni").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      email: document.getElementById("email").value.trim()
    },
    medicoId: medicoId,
    medicoNombre: medicoNombre,
    especialidad: especialidad,
    fecha: document.getElementById("fecha").value,
    hora: document.getElementById("hora").value,
    obraSocial: document.getElementById("obraSocial").value,
    estado: "pendiente", // Los turnos públicos empiezan como pendientes
    motivo: document.getElementById("motivo").value.trim()
  };

  // Guardar turno
  guardarTurno(nuevoTurno);

  // Mostrar mensaje de éxito
  alertaExito.classList.remove("d-none");
  formulario.reset();
  formulario.classList.remove("was-validated");

  // Restablecer fecha mínima después del reset
  if (fechaInput) {
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;
  }

  // Scroll hacia arriba para ver el mensaje
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Ocultar mensaje después de 8 segundos
  setTimeout(() => {
    alertaExito.classList.add("d-none");
  }, 8000);
});

// Cargar médicos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarOpcionesMedicos();
});