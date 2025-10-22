const KEY = "medicos";

function cargarMedicos() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(medicos));
    return [...medicos];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...medicos];
  } catch {
    return [...medicos];
  }
}

function guardarMedicos(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

function convertirA64(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(archivo);
  });
}

const tbody = document.getElementById("tbodyMedicos");

function formatearMoneda(valor) {
  return `$ ${Number(valor).toLocaleString("es-AR")}`;
}

function renderTabla(medicos) {
  if (!tbody) return;
  tbody.innerHTML = medicos
    .map((m, idx) => {
      return `
        <tr>
          <td><img src="${m.imagen}" alt="${m.nombre} ${
        m.apellido
      }" class="rounded" width="60" height="60"></td>
          <td>${m.apellido}</td>
          <td>${m.nombre}</td>
          <td>${m.matricula}</td>
          <td>${m.especialidad}</td>
          <td>${m.telefono}</td>
          <td>${m.obraSocial}</td>
          <td>${m.email}</td>
          <td>${formatearMoneda(m.valorConsulta)}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-danger" data-action="eliminar" data-index="${idx}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

const altaMedicoForm = document.getElementById("altaMedicoForm");

let medicosGuardados = cargarMedicos();
renderTabla(medicosGuardados);

altaMedicoForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const archivo = document.getElementById("imagen").files[0];
  let imagenBase64 = "assets/default.jpeg";

  if (archivo) {
    try {
      imagenBase64 = await convertirA64(archivo);
    } catch (error) {
      console.error("Error al convertir la imagen:", error);
    }
  }

  const nuevo = {
    id: Date.now(),
    apellido: document.getElementById("apellido").value.trim(),
    nombre: document.getElementById("nombre").value.trim(),
    matricula: document.getElementById("matricula").value.trim(),
    especialidad: document.getElementById("especialidad").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    obraSocial: document.getElementById("obraSocial").value.trim(),
    email: document.getElementById("email").value.trim(),
    valorConsulta: Number(document.getElementById("valorConsulta").value),
    imagen: imagenBase64,
  };

  medicosGuardados.push(nuevo);
  guardarMedicos(medicosGuardados);
  renderTabla(medicosGuardados);

  altaMedicoForm.reset();

  const modalEl = document.getElementById("modalMedico");
  const modalInstance =
    bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  modalInstance.hide();
});

let indexAEliminar = null;
const confirmModalEl = document.getElementById("confirmDeleteModal");
const confirmModal = confirmModalEl
  ? new bootstrap.Modal(confirmModalEl)
  : null;
const confirmNombreEl = document.getElementById("confirmDeleteNombre");
const btnConfirmDelete = document.getElementById("btnConfirmDelete");

tbody?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action='eliminar']");
  if (!btn) return;

  const idx = Number(btn.dataset.index);
  if (!Number.isInteger(idx)) return;

  indexAEliminar = idx;
  const m = medicosGuardados[idx];
  if (confirmNombreEl) {
    confirmNombreEl.textContent = `${m.apellido}, ${m.nombre}`;
  }
  confirmModal?.show();
});

btnConfirmDelete?.addEventListener("click", () => {
  if (indexAEliminar == null) return;
  medicosGuardados.splice(indexAEliminar, 1);
  guardarMedicos(medicosGuardados);
  renderTabla(medicosGuardados);
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
