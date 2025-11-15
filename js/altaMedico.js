verificarAutenticacion();

const KEY_MEDICOS = "medicos";
const KEY_ESPECIALIDADES = "especialidades";
const KEY_OBRAS_SOCIALES = "obrasSociales";
let editIndex = null;

document
  .querySelector('[data-bs-target="#modalMedico"]')
  ?.addEventListener("click", () => {
    editIndex = null;
    altaMedicoForm.reset();
    document.getElementById("modalMedicoLabel").textContent = "Alta de Médico";
    const btnSubmit = altaMedicoForm.querySelector("button[type='submit']");
    if (btnSubmit) btnSubmit.textContent = "Guardar médico";
  });

const modalMedicoEl = document.getElementById("modalMedico");
if (modalMedicoEl) {
  modalMedicoEl.addEventListener("show.bs.modal", () => {
    cargarEspecialidadesEnMedicos();
    cargarObrasSocialesEnMedicos();
  });
}

function cargarEspecialidadesEnMedicos() {
  const selectEspecialidad = document.getElementById("especialidad");
  if (!selectEspecialidad) return;

  while (selectEspecialidad.options.length > 1) {
    selectEspecialidad.remove(1);
  }

  const especialidades =
    JSON.parse(localStorage.getItem(KEY_ESPECIALIDADES)) || [];

  especialidades.forEach((esp) => {
    const option = document.createElement("option");
    option.value = esp.nombre;
    option.textContent = esp.nombre;
    selectEspecialidad.appendChild(option);
  });
}

function cargarObrasSocialesEnMedicos() {
  const selectObraSocial = document.getElementById("obraSocial");
  if (!selectObraSocial) return;

  while (selectObraSocial.options.length > 1) {
    selectObraSocial.remove(1);
  }

  const obrasSociales =
    JSON.parse(localStorage.getItem(KEY_OBRAS_SOCIALES)) || [];

  obrasSociales.forEach((os) => {
    const option = document.createElement("option");
    option.value = os.nombre;
    option.textContent = os.nombre;
    selectObraSocial.appendChild(option);
  });
}

function cargarMedicos() {
  const raw = localStorage.getItem(KEY_MEDICOS);
  if (!raw) {
    localStorage.setItem(KEY_MEDICOS, JSON.stringify(medicos || []));
    return medicos || [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : medicos || [];
  } catch {
    return medicos || [];
  }
}

function guardarMedicos(arr) {
  localStorage.setItem(KEY_MEDICOS, JSON.stringify(arr));
}

const tbodyMedicos = document.getElementById("tbodyMedicos");

function renderTabla(medicosArr) {
  if (!tbodyMedicos) return;

  if (medicosArr.length === 0) {
    tbodyMedicos.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-4">
          <i class="bi bi-person-x fs-1 d-block mb-2"></i>
          No hay médicos registrados
        </td>
      </tr>
    `;
    return;
  }

  tbodyMedicos.innerHTML = medicosArr
    .map((medico, idx) => {
      return `
        <tr>
          <td><img src="${medico.imagen || "assets/default.png"}" alt="${
        medico.nombre
      }" style="width: 50px; height: 50px; border-radius: 50%;"></td>
          <td>${medico.apellido}</td>
          <td>${medico.nombre}</td>
          <td>${medico.matricula}</td>
          <td>${medico.especialidad}</td>
          <td>${medico.email}</td>
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

const altaMedicoForm = document.getElementById("altaMedicoForm");
let medicosGuardados = cargarMedicos();

renderTabla(medicosGuardados);

altaMedicoForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const apellido = document.getElementById("apellido").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const matricula = document.getElementById("matricula").value.trim();
  const especialidad = document.getElementById("especialidad").value;
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const obraSocial = document.getElementById("obraSocial").value || "";
  const valorConsulta = document.getElementById("valorConsulta").value;
  const fotoInput = document.getElementById("foto");

  if (!apellido || !nombre || !matricula || !especialidad || !email) {
    alert("Por favor completa todos los campos requeridos");
    return;
  }

  const payload = {
    apellido,
    nombre,
    matricula,
    especialidad,
    email,
    telefono,
    obraSocial,
    valorConsulta: parseFloat(valorConsulta) || 0,
    foto:
      fotoInput.files.length > 0
        ? URL.createObjectURL(fotoInput.files[0])
        : "assets/default.png",
  };

  if (editIndex === null) {
    medicosGuardados.push({ id: Date.now().toString(), ...payload });
  } else {
    medicosGuardados[editIndex] = {
      ...medicosGuardados[editIndex],
      ...payload,
    };
  }

  guardarMedicos(medicosGuardados);
  renderTabla(medicosGuardados);

  altaMedicoForm.reset();
  const modalEl = document.getElementById("modalMedico");
  (bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)).hide();

  editIndex = null;
  document.getElementById("modalMedicoLabel").textContent = "Alta de Médico";
  const btnSubmit = altaMedicoForm.querySelector("button[type='submit']");
  if (btnSubmit) btnSubmit.textContent = "Guardar médico";
});

let indexAEliminar = null;
const confirmModalEl = document.getElementById("confirmDeleteModal");
const confirmModal = confirmModalEl
  ? new bootstrap.Modal(confirmModalEl)
  : null;
const confirmNombreEl = document.getElementById("confirmDeleteNombre");
const btnConfirmDelete = document.getElementById("btnConfirmDelete");

tbodyMedicos?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.getAttribute("data-action");
  const idx = Number(btn.getAttribute("data-index"));
  if (!Number.isInteger(idx)) return;

  if (action === "eliminar") {
    indexAEliminar = idx;
    const medico = medicosGuardados[idx];
    if (confirmNombreEl) {
      confirmNombreEl.textContent = `${medico.apellido} ${medico.nombre}`;
    }

    if (confirmModal) {
      confirmModal.show();
    } else {
      const ok = window.confirm(
        `¿Eliminar a ${medico.apellido} ${medico.nombre}?`
      );
      if (ok) {
        medicosGuardados.splice(idx, 1);
        guardarMedicos(medicosGuardados);
        renderTabla(medicosGuardados);
      }
    }
    return;
  }

  if (action === "editar") {
    editIndex = idx;
    const medico = medicosGuardados[idx];

    document.getElementById("apellido").value = medico.apellido || "";
    document.getElementById("nombre").value = medico.nombre || "";
    document.getElementById("matricula").value = medico.matricula || "";
    document.getElementById("especialidad").value = medico.especialidad || "";
    document.getElementById("email").value = medico.email || "";
    document.getElementById("telefono").value = medico.telefono || "";
    document.getElementById("obraSocial").value = medico.obraSocial || "";
    document.getElementById("valorConsulta").value = medico.valorConsulta || "";

    document.getElementById("modalMedicoLabel").textContent = "Editar Médico";
    const btnSubmit = altaMedicoForm.querySelector("button[type='submit']");
    if (btnSubmit) btnSubmit.textContent = "Guardar cambios";

    const modalEl = document.getElementById("modalMedico");
    (
      bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    ).show();
  }
});

btnConfirmDelete?.addEventListener("click", () => {
  if (indexAEliminar == null) return;
  medicosGuardados.splice(indexAEliminar, 1);
  guardarMedicos(medicosGuardados);
  renderTabla(medicosGuardados);
  indexAEliminar = null;
  confirmModal?.hide();
});
