(function () {
  const KEY = "medicos";
  const CONT_ID = "cardsProfesionales";
  const IMG_DEFAULT = "assets/default.jpeg";

  function cargarMedicos() {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) return arr;
      } catch {}
    }
    if (Array.isArray(window.medicos)) return window.medicos;
    return [];
  }

  function safe(val, def = "") {
    return (val ?? "").toString().trim() || def;
  }

  function moneda(v) {
    const n = Number(v);
    return Number.isFinite(n) ? `$ ${n.toLocaleString("es-AR")}` : "-";
  }

  function cardMedico(m) {
    const img = safe(m.imagen, IMG_DEFAULT);
    const nombreCompleto = `${safe(m.nombre)} ${safe(m.apellido)}`;
    const especialidad = safe(m.especialidad, "Especialidad");
    const obra = safe(m.obraSocial, "—");
    const dh = safe(m.diasHorarios, "A coordinar");
    const valor = moneda(m.valorConsulta);

    return `
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="card h-100">
          <img class="card-img-top" src="${img}" alt="${nombreCompleto}" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${nombreCompleto}</h5>
            <p class="card-text"><strong>Especialidad: </strong>${especialidad}</p>
            <p class="card-text"><strong>Días y horarios: </strong>${dh}</p>
            <p class="card-text"><strong>Obra Social: </strong>${obra}</p>
            <p class="card-text"><strong>Valor: </strong>${valor}</p>
            <a href="contacto.html" class="btn btn-primary mt-auto w-100">Pedir turno</a>
          </div>
        </div>
      </div>
    `;
  }

  function render() {
    const cont = document.getElementById(CONT_ID);
    if (!cont) {
      console.error("No se encontró el contenedor con id:", CONT_ID);
      return;
    }

    const medicos = cargarMedicos();
    if (!medicos.length) {
      cont.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info">Aún no hay profesionales registrados.</div>
        </div>`;
      return;
    }

    cont.innerHTML = medicos.map(cardMedico).join("");
  }

  document.addEventListener("DOMContentLoaded", render);
})();
