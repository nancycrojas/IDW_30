const KEY_TURNOS = "turnos";
const KEY_MEDICOS = "medicos";
let editIndex = null;

document
  .querySelector('[data-bs-target="#modalTurno"]')
  ?.addEventListener("click", () => {
    editIndex = null;
    altaTurnoForm.reset();
    document.getElementById("modalTurnoLabel").textContent = "Alta de Turno";
    const btnSubmit = altaTurnoForm.querySelector("button[type='submit']");
    if (btnSubmit) btnSubmit.textContent = "Guardar turno";

    const hoy = new Date().toISOString().split("T")[0];
    document.getElementById("turnoFecha").setAttribute("min", hoy);
  });

const modalTurnoEl = document.getElementById("modalTurno");
if (modalTurnoEl) {
  modalTurnoEl.addEventListener("show.bs.modal", () => {
    cargarObrasSocialesEnTurnos();
  });
}

function cargarObrasSocialesEnTurnos() {
  const selectObraSocial = document.getElementById("obraSocial");
  if (!selectObraSocial) return;

  while (selectObraSocial.options.length > 2) {
    selectObraSocial.remove(2);
  }

  const obrasSociales = JSON.parse(localStorage.getItem("obrasSociales")) || [];

  const obrasSocialesActivas = obrasSociales.filter(
    (os) => os.estado === "Activa"
  );

  obrasSocialesActivas.forEach((os) => {
    const option = document.createElement("option");
    option.value = os.nombre;
    option.textContent = `${os.nombre} - ${os.plan}`;
    selectObraSocial.appendChild(option);
  });
}

function cargarTurnos() {
  const raw = localStorage.getItem(KEY_TURNOS);
  if (!raw) {
    localStorage.setItem(KEY_TURNOS, JSON.stringify(turnos));
    return [...turnos];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...turnos];
  } catch {
    return [...turnos];
  }
}

function guardarTurnos(arr) {
  localStorage.setItem(KEY_TURNOS, JSON.stringify(arr));
}

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

function formatearFecha(fecha) {
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
}

function getNombreObraSocial(codigo) {
  if (codigo === "particular") {
    return "Particular / No tengo";
  }

  const obrasSociales = JSON.parse(localStorage.getItem("obrasSociales")) || [];
  const osEncontrada = obrasSociales.find((os) => os.nombre === codigo);

  return osEncontrada
    ? `${osEncontrada.nombre} - ${osEncontrada.plan}`
    : codigo;
}

function getBadgeEstado(estado) {
  const badges = {
    pendiente: "badge bg-warning text-dark",
    confirmado: "badge bg-success",
    cancelado: "badge bg-danger",
    completado: "badge bg-secondary",
  };
  const textos = {
    pendiente: "Pendiente",
    confirmado: "Confirmado",
    cancelado: "Cancelado",
    completado: "Completado",
  };
  return `<span class="${badges[estado] || "badge bg-secondary"}">${
    textos[estado] || estado
  }</span>`;
}

const tbody = document.getElementById("tbodyTurnos");

function renderTabla(turnos) {
  if (!tbody) return;

  if (turnos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center text-muted py-4">
          <i class="bi bi-calendar-x fs-1 d-block mb-2"></i>
          No hay turnos registrados
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = turnos
    .map((turno, idx) => {
      return `
        <tr>
          <td>${formatearFecha(turno.fecha)}</td>
          <td><strong>${turno.hora}</strong></td>
          <td>${turno.paciente.nombre}</td>
          <td>${turno.paciente.dni}</td>
          <td>Dr/a. ${turno.medicoNombre}</td>
          <td>${turno.especialidad}</td>
          <td>${getNombreObraSocial(turno.obraSocial)}</td>
          <td>${getBadgeEstado(turno.estado)}</td>
          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <button class="btn btn-outline-primary" data-action="editar" data-index="${idx}" title="Editar">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" data-action="eliminar" data-index="${idx}" title="Eliminar">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function cargarOpcionesMedicos() {
  const select = document.getElementById("turnoMedico");
  if (!select) return;

  const medicosDisponibles = cargarMedicos();
  select.innerHTML =
    '<option value="">Seleccione un médico</option>' +
    medicosDisponibles
      .map(
        (m) =>
          `<option value="${m.id}" data-especialidad="${m.especialidad}">${m.apellido}, ${m.nombre} - ${m.especialidad}</option>`
      )
      .join("");
}

document.getElementById("turnoMedico")?.addEventListener("change", (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const especialidad = selectedOption.getAttribute("data-especialidad");
  document.getElementById("turnoEspecialidad").value = especialidad || "";
});

const altaTurnoForm = document.getElementById("altaTurnoForm");
let turnosGuardados = cargarTurnos();

cargarOpcionesMedicos();

renderTabla(turnosGuardados);

altaTurnoForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const medicoSelect = document.getElementById("turnoMedico");
  const medicoOption = medicoSelect.options[medicoSelect.selectedIndex];
  const medicoId = medicoSelect.value;
  const medicoTexto = medicoOption.text;
  const medicoNombre = medicoTexto.split(" - ")[0];

  const payload = {
    paciente: {
      nombre: document.getElementById("pacienteNombre").value.trim(),
      dni: document.getElementById("pacienteDNI").value.trim(),
      telefono: document.getElementById("pacienteTelefono").value.trim(),
      email: document.getElementById("pacienteEmail").value.trim(),
    },
    medicoId: medicoId,
    medicoNombre: medicoNombre,
    especialidad: document.getElementById("turnoEspecialidad").value.trim(),
    fecha: document.getElementById("turnoFecha").value,
    hora: document.getElementById("turnoHora").value,
    obraSocial: document.getElementById("obraSocial").value,
    estado: document.getElementById("estadoTurno").value,
    motivo: document.getElementById("motivoConsulta").value.trim(),
  };

  if (editIndex === null) {
    turnosGuardados.push({ id: Date.now().toString(), ...payload });
  } else {
    turnosGuardados[editIndex] = {
      ...turnosGuardados[editIndex],
      ...payload,
    };
  }

  guardarTurnos(turnosGuardados);
  renderTabla(turnosGuardados);

  altaTurnoForm.reset();
  const modalEl = document.getElementById("modalTurno");
  (bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)).hide();

  editIndex = null;
  document.getElementById("modalTurnoLabel").textContent = "Alta de Turno";
  const btnSubmit = altaTurnoForm.querySelector("button[type='submit']");
  if (btnSubmit) btnSubmit.textContent = "Guardar turno";
});

let indexAEliminar = null;
const confirmModalEl = document.getElementById("confirmDeleteModal");
const confirmModal = confirmModalEl
  ? new bootstrap.Modal(confirmModalEl)
  : null;
const confirmNombreEl = document.getElementById("confirmDeleteNombre");
const btnConfirmDelete = document.getElementById("btnConfirmDelete");

tbody?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.getAttribute("data-action");
  const idx = Number(btn.getAttribute("data-index"));
  if (!Number.isInteger(idx)) return;

  if (action === "eliminar") {
    indexAEliminar = idx;
    const turno = turnosGuardados[idx];
    if (confirmNombreEl) {
      confirmNombreEl.textContent = turno.paciente.nombre;
    }

    if (confirmModal) {
      confirmModal.show();
    } else {
      const ok = window.confirm(
        `¿Eliminar el turno de ${turno.paciente.nombre}?`
      );
      if (ok) {
        turnosGuardados.splice(idx, 1);
        guardarTurnos(turnosGuardados);
        renderTabla(turnosGuardados);
      }
    }
    return;
  }

  if (action === "editar") {
    editIndex = idx;
    const turno = turnosGuardados[idx];

    document.getElementById("pacienteNombre").value =
      turno.paciente.nombre || "";
    document.getElementById("pacienteDNI").value = turno.paciente.dni || "";
    document.getElementById("pacienteTelefono").value =
      turno.paciente.telefono || "";
    document.getElementById("pacienteEmail").value = turno.paciente.email || "";
    document.getElementById("turnoMedico").value = turno.medicoId || "";
    document.getElementById("turnoEspecialidad").value =
      turno.especialidad || "";
    document.getElementById("turnoFecha").value = turno.fecha || "";
    document.getElementById("turnoHora").value = turno.hora || "";
    document.getElementById("obraSocial").value =
      turno.obraSocial || "particular";
    document.getElementById("estadoTurno").value = turno.estado || "pendiente";
    document.getElementById("motivoConsulta").value = turno.motivo || "";

    document.getElementById("modalTurnoLabel").textContent = "Editar Turno";
    const btnSubmit = altaTurnoForm.querySelector("button[type='submit']");
    if (btnSubmit) btnSubmit.textContent = "Guardar cambios";

    const modalEl = document.getElementById("modalTurno");
    (
      bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    ).show();
  }
});

btnConfirmDelete?.addEventListener("click", () => {
  if (indexAEliminar == null) return;
  turnosGuardados.splice(indexAEliminar, 1);
  guardarTurnos(turnosGuardados);
  renderTabla(turnosGuardados);
  indexAEliminar = null;
  confirmModal?.hide();
});

document.addEventListener("DOMContentLoaded", () => {
  const nombre = sessionStorage.getItem("usuarioLogueado");
  const saludo = document.getElementById("saludoUsuario");
  const btnLogout = document.getElementById("btnLogout");

  if (!nombre) {
    window.location.href = "index.html";
  } else {
    const nombreCap =
      nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
    if (saludo) saludo.textContent = `👋 Bienvenido/a ${nombreCap}`;
    btnLogout?.addEventListener("click", () => {
      sessionStorage.removeItem("usuarioLogueado");
      window.location.href = "index.html";
    });
  }
});
