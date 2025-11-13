verificarAutenticacion();

const KEY_ESPECIALIDADES = "especialidades";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formEspecialidad");
  const tablaBody = document.querySelector("#tablaEspecialidades tbody");
  const modal = new bootstrap.Modal(
    document.getElementById("modalEspecialidad")
  );
  let editIndex = null;

  function cargarEspecialidades() {
    const raw = localStorage.getItem(KEY_ESPECIALIDADES);
    if (!raw) {
      const iniciales = [
        {
          id: 1,
          nombre: "Cardiología",
          descripcion: "Tratamiento de enfermedades del corazón",
        },
        {
          id: 2,
          nombre: "Dermatología",
          descripcion: "Tratamiento de afecciones de la piel",
        },
        {
          id: 3,
          nombre: "Pediatría",
          descripcion: "Atención médica de niños y adolescentes",
        },
      ];
      localStorage.setItem(KEY_ESPECIALIDADES, JSON.stringify(iniciales));
      return [...iniciales];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  let especialidades = cargarEspecialidades();

  function guardarEspecialidades() {
    localStorage.setItem(KEY_ESPECIALIDADES, JSON.stringify(especialidades));
  }

  function renderEspecialidades() {
    tablaBody.innerHTML = "";
    if (especialidades.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="4" class="text-center">No hay especialidades registradas.</td></tr>`;
      return;
    }

    especialidades.forEach((esp, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${esp.id}</td>
        <td>${esp.nombre}</td>
        <td>${esp.descripcion || "-"}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning btn-edit" data-index="${index}">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-danger btn-delete" data-index="${index}">
            <i class="bi bi-trash"></i>
          </button>
        </td>`;
      tablaBody.appendChild(tr);
    });

    document
      .querySelectorAll(".btn-edit")
      .forEach((btn) => btn.addEventListener("click", handleEdit));
    document
      .querySelectorAll(".btn-delete")
      .forEach((btn) => btn.addEventListener("click", handleDelete));
  }

  function handleEdit(e) {
    editIndex = e.currentTarget.dataset.index;
    const esp = especialidades[editIndex];
    document.getElementById("especialidadId").value = esp.id;
    document.getElementById("nombre").value = esp.nombre;
    document.getElementById("descripcion").value = esp.descripcion || "";
    document.getElementById("modalEspecialidadLabel").textContent =
      "Editar Especialidad";
    modal.show();
  }

  function handleDelete(e) {
    const index = e.currentTarget.dataset.index;
    if (confirm("¿Seguro que desea eliminar esta especialidad?")) {
      especialidades.splice(index, 1);
      guardarEspecialidades();
      renderEspecialidades();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("especialidadId").value || Date.now();
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    const nuevaEspecialidad = { id, nombre, descripcion };

    if (editIndex !== null) {
      especialidades[editIndex] = nuevaEspecialidad;
    } else {
      especialidades.push(nuevaEspecialidad);
    }

    guardarEspecialidades();
    renderEspecialidades();
    modal.hide();
    form.reset();
    document.getElementById("modalEspecialidadLabel").textContent =
      "Nueva Especialidad";
    editIndex = null;
  });

  renderEspecialidades();
});
