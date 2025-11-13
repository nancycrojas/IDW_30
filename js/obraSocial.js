const KEY_OBRAS_SOCIALES = "obrasSociales";
let editIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  const obrasSociales =
    JSON.parse(localStorage.getItem("obrasSociales")) || [];

  const form = document.getElementById("altaObraSocialForm");
  const tablaBody = document.querySelector("#tablaObrasSociales tbody");
  const modal = new bootstrap.Modal(document.getElementById("modalObraSocial"));
  const confirmDeleteModal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  const confirmDeleteNombre = document.getElementById("confirmDeleteNombre");
  const btnConfirmDelete = document.getElementById("btnConfirmDelete");

  let editIndex = null;
  let deleteIndex = null;

  const renderObrasSociales = () => {
    tablaBody.innerHTML = "";
    if (obrasSociales.length === 0) {
      tablaBody.innerHTML =
        '<tr><td colspan="4" class="text-center">No hay obras sociales registradas.</td></tr>';
      return;
    }

    obrasSociales.forEach((os, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${os.nombre}</td>
        <td>${os.plan}</td>
        <td>
          <span class="badge ${
            os.estado === "Activa" ? "bg-success" : "bg-danger"
          }">${os.estado}</span>
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning btn-edit" data-index="${index}" title="Editar">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-danger btn-delete" data-index="${index}" title="Eliminar">
            <i class="bi bi-trash"></i>
          </button>
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
  };

  const handleEdit = (e) => {
    editIndex = e.currentTarget.dataset.index;
    const os = obrasSociales[editIndex];

    document.getElementById("nombre").value = os.nombre;
    document.getElementById("plan").value = os.plan;
    document.getElementById("estado").value = os.estado;

    document.getElementById("modalObraSocialLabel").textContent =
      "Editar Obra Social";
    modal.show();
  };

  const handleDelete = (e) => {
    deleteIndex = e.currentTarget.dataset.index;
    const os = obrasSociales[deleteIndex];
    confirmDeleteNombre.textContent = `${os.nombre} - ${os.plan}`;
    confirmDeleteModal.show();
  };

  btnConfirmDelete.addEventListener("click", () => {
    obrasSociales.splice(deleteIndex, 1);
    saveAndRender();
    confirmDeleteModal.hide();
    deleteIndex = null;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevaObraSocial = {
      nombre: document.getElementById("nombre").value,
      plan: document.getElementById("plan").value,
      estado: document.getElementById("estado").value,
    };

    if (editIndex !== null) {
      obrasSociales[editIndex] = nuevaObraSocial;
    } else {
      obrasSociales.push(nuevaObraSocial);
    }

    saveAndRender();
    modal.hide();
    form.reset();
    editIndex = null;
    document.getElementById("modalObraSocialLabel").textContent =
      "Alta de Obra Social";
  });

  document
    .getElementById("modalObraSocial")
    .addEventListener("hidden.bs.modal", () => {
      form.reset();
      editIndex = null;
      document.getElementById("modalObraSocialLabel").textContent =
        "Alta de Obra Social";
    });

  const saveAndRender = () => {
    localStorage.setItem("obrasSociales", JSON.stringify(obrasSociales));
    renderObrasSociales();
  };

  
  renderObrasSociales();

  if (obrasSociales.length === 0) {
    const obrasSocialesIniciales = [
      { nombre: "OSDE", plan: "210", estado: "Activa" },
      { nombre: "Swiss Medical", plan: "SMG20", estado: "Activa" },
      { nombre: "Galeno", plan: "Plata", estado: "Inactiva" },
      { nombre: "IOMA", plan: "General", estado: "Activa" },
    ];
    obrasSociales.push(...obrasSocialesIniciales);
    saveAndRender();
  }
});