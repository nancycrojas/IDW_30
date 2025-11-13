verificarAutenticacion();
const KEY_OBRAS_SOCIALES = "obrasSociales";
let editIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("altaObraSocialForm");
  const tablaBody = document.querySelector("#tablaObrasSociales tbody");
  const modal = new bootstrap.Modal(document.getElementById("modalObraSocial"));
  const confirmDeleteModal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  const confirmDeleteNombre = document.getElementById("confirmDeleteNombre");
  const btnConfirmDelete = document.getElementById("btnConfirmDelete");

  let deleteIndex = null;

  function cargarObrasSociales() {
    const raw = localStorage.getItem(KEY_OBRAS_SOCIALES);
    if (!raw) {
      const iniciales = [
        {
          nombre: "OSDE",
          plan: "210",
          descripcion: "Cobertura nacional con amplia cartilla médica",
          estado: "Activa",
        },
        {
          nombre: "Swiss Medical",
          plan: "SMG20",
          descripcion: "Atención en centros de alta complejidad",
          estado: "Activa",
        },
        {
          nombre: "Galeno",
          plan: "Plata",
          descripcion: "Cobertura parcial con prestadores seleccionados",
          estado: "Inactiva",
        },
        {
          nombre: "IOMA",
          plan: "General",
          descripcion: "Cobertura para empleados públicos de Buenos Aires",
          estado: "Activa",
        },
      ];
      localStorage.setItem(KEY_OBRAS_SOCIALES, JSON.stringify(iniciales));
      return [...iniciales];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  let obrasSociales = cargarObrasSociales();

  function guardarObrasSociales(arr) {
    localStorage.setItem(KEY_OBRAS_SOCIALES, JSON.stringify(arr));
  }

  function renderObrasSociales() {
    tablaBody.innerHTML = "";
    if (obrasSociales.length === 0) {
      tablaBody.innerHTML =
        '<tr><td colspan="5" class="text-center">No hay obras sociales registradas.</td></tr>';
      return;
    }

    obrasSociales.forEach((os, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${os.nombre}</td>
        <td>${os.plan}</td>
        <td>${os.descripcion || "-"}</td>
        <td>
          <span class="badge ${
            os.estado === "Activa" ? "bg-success" : "bg-danger"
          }">${os.estado}</span>
        </td>
        <td class="text-center">
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-sm btn-warning btn-edit" data-index="${index}" title="Editar">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger btn-delete" data-index="${index}" title="Eliminar">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      tablaBody.appendChild(tr);
    });

    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", handleEdit);
    });
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", handleDelete);
    });
  }

  function handleEdit(e) {
    editIndex = e.currentTarget.dataset.index;
    const os = obrasSociales[editIndex];

    document.getElementById("nombre").value = os.nombre;
    document.getElementById("plan").value = os.plan;
    document.getElementById("descripcion").value = os.descripcion || "";
    document.getElementById("estado").value = os.estado;

    document.getElementById("modalObraSocialLabel").textContent =
      "Editar Obra Social";
    modal.show();
  }

  function handleDelete(e) {
    deleteIndex = e.currentTarget.dataset.index;
    const os = obrasSociales[deleteIndex];
    confirmDeleteNombre.textContent = `${os.nombre} - ${os.plan}`;
    confirmDeleteModal.show();
  }

  btnConfirmDelete.addEventListener("click", () => {
    obrasSociales.splice(deleteIndex, 1);
    guardarObrasSociales(obrasSociales);
    renderObrasSociales();
    confirmDeleteModal.hide();
    deleteIndex = null;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevaObraSocial = {
      nombre: document.getElementById("nombre").value,
      plan: document.getElementById("plan").value,
      descripcion: document.getElementById("descripcion").value.trim(),
      estado: document.getElementById("estado").value,
    };

    if (editIndex !== null) {
      obrasSociales[editIndex] = nuevaObraSocial;
    } else {
      obrasSociales.push(nuevaObraSocial);
    }

    guardarObrasSociales(obrasSociales);
    renderObrasSociales();
    modal.hide();
    form.reset();
    editIndex = null;
    document.getElementById("modalObraSocialLabel").textContent =
      "Alta de Obra Social";
  });

  document
    .getElementById("modalObraSocial")
    ?.addEventListener("hidden.bs.modal", () => {
      form.reset();
      editIndex = null;
      document.getElementById("modalObraSocialLabel").textContent =
        "Alta de Obra Social";
    });

  renderObrasSociales();
});
