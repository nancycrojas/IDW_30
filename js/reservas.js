<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
  <link rel="stylesheet" href="css/styles.css" />
  <title>Reservas - Centro Médico San Benjamin</title>
</head>
<body>
  <header class="p-4">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
          <div class="brand-logo rounded-circle text-white d-grid justify-content-center align-items-center fw-bold">SB</div>
          <div class="text-logo d-flex flex-column">
            <strong class="brand-title">
              <span class="d-inline d-md-none">
                <span class="d-block">Centro Médico</span>
                <span class="d-block">San Benjamin</span>
              </span>
              <span class="d-none d-md-inline">Centro Médico San Benjamin</span>
            </strong>
            <span>Salud integral y cercana</span>
          </div>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto header-nav">
            <li class="nav-item">
              <a class="nav-link" href="altaMedico.html">Médicos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="usuarios.html">Usuarios</a>
            </li>
            <li class="nav-item">
              <a id="saludoUsuario" class="nav-link"></a>
            </li>
            <li class="nav-item ms-lg-2">
              <button id="btnLogout" class="btn btn-sm mb-2">Cerrar sesión</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <main class="container my-5">
    <section>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Reservas de Turnos</h2>
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalReserva">
          <i class="bi bi-calendar-plus"></i> Nueva Reserva
        </button>
      </div>

      <!-- Tabla de Reservas -->
      <div class="table-responsive">
        <table class="table table-striped align-middle" id="tablaReservas">
          <thead class="table-light">
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  </main>

  <!-- Modal para Crear/Editar Reserva -->
  <div class="modal fade" id="modalReserva" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <form id="formReserva">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle">Nueva Reserva</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="reservaId" />

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Paciente</label>
                <input type="text" class="form-control" id="paciente" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Médico</label>
                <select class="form-select" id="medico" required></select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha</label>
                <input type="date" class="form-control" id="fecha" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Hora</label>
                <input type="time" class="form-control" id="hora" required />
              </div>
              <div class="col-12">
                <label class="form-label">Estado</label>
                <select class="form-select" id="estado">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal Confirmar Eliminación -->
  <div class="modal fade" id="modalConfirmar" tabindex="-1">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmar</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          ¿Eliminar esta reserva?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">No</button>
          <button type="button" class="btn btn-danger" id="btnEliminar">Sí, eliminar</button>
        </div>
      </div>
    </div>
  </div>

  <footer class="py-4 mt-5 border-top note">
    <div class="container text-center">
      <p class="mb-1">&copy; 2025 Centro Médico San Benjamin</p>
      <p class="small mb-3">Av. De Los Rusos 1200, Entre Ríos - Tel: (011) 5555-1234</p>
      <div>
        <a href="#" class="me-3"><i class="bi bi-facebook fs-4"></i></a>
        <a href="#" class="me-3"><i class="bi bi-instagram fs-4"></i></a>
        <a href="#" class="me-3"><i class="bi bi-whatsapp fs-4"></i></a>
      </div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
  <script src="data/medicos.js"></script>
  <script src="js/main.js"></script>
  <script src="js/reservas.js"></script>
</body>
</html>