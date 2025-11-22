const API_BASE = 'http://localhost:3000/api';

// Vistas
const vistaListado = document.getElementById('vistaListado');
const vistaNuevo = document.getElementById('vistaNuevo');
const navButtons = document.querySelectorAll('.nav-btn');

// Buscar / tabla
const tablaBody = document.querySelector('#tablaLibros tbody');
const searchInput = document.getElementById('searchInput');
const btnBuscar = document.getElementById('btnBuscar');
const btnLimpiar = document.getElementById('btnLimpiar');

// Form autor+libro (nueva vista)
const formAutorLibro = document.getElementById('formAutorLibro');
const nuevoAutorNombre = document.getElementById('nuevoAutorNombre');
const nuevoAutorApellidos = document.getElementById('nuevoAutorApellidos');
const nuevoTitulo = document.getElementById('nuevoTitulo');
const nuevoPaginas = document.getElementById('nuevoPaginas');
const nuevoFecha = document.getElementById('nuevoFecha');
const nuevoEditorial = document.getElementById('nuevoEditorial');
const mensaje = document.getElementById('mensaje');

// Form edición
const panelEditar = document.getElementById('panelEditar');
const formEditarLibro = document.getElementById('formEditarLibro');
const editIdLibro = document.getElementById('editIdLibro');
const editTitulo = document.getElementById('editTitulo');
const editPaginas = document.getElementById('editPaginas');
const editFecha = document.getElementById('editFecha');
const editEditorial = document.getElementById('editEditorial');
const editAutor = document.getElementById('editAutor');
const btnCancelarEdicion = document.getElementById('btnCancelarEdicion');

// --- helpers ---
function mostrarMensaje(texto, tipo = 'ok') {
  if (!mensaje) return;
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  setTimeout(() => {
    mensaje.textContent = '';
    mensaje.className = 'mensaje';
  }, 3000);
}

// Cambiar vistas
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const vista = btn.getAttribute('data-vista');
    if (vista === 'listado') {
      vistaListado.classList.remove('hidden');
      vistaNuevo.classList.add('hidden');
    } else {
      vistaNuevo.classList.remove('hidden');
      vistaListado.classList.add('hidden');
    }
  });
});

// ----- API: autores -----
async function obtenerAutores() {
  const res = await fetch(`${API_BASE}/autores`);
  return await res.json();
}

// Cargar autores en el select de edición
async function cargarAutoresEdicion() {
  try {
    const autores = await obtenerAutores();
    editAutor.innerHTML = '';
    autores.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id_autor;
      opt.textContent = `${a.apellidos}, ${a.nombre}`;
      editAutor.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
  }
}

// ----- API: libros / listado -----
async function cargarLibros(query = '') {
  try {
    const url = query
      ? `${API_BASE}/libros?q=${encodeURIComponent(query)}`
      : `${API_BASE}/libros`;

    const res = await fetch(url);
    const libros = await res.json();
    tablaBody.innerHTML = '';

    if (!libros.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 7;
      td.textContent = 'No hay libros registrados.';
      tr.appendChild(td);
      tablaBody.appendChild(tr);
      return;
    }

    libros.forEach(l => {
      const tr = document.createElement('tr');
      const autorNombre = `${l.apellidos}, ${l.nombre}`;

      tr.innerHTML = `
        <td>${l.id_libro}</td>
        <td>${l.titulo}</td>
        <td>${autorNombre}</td>
        <td>${l.paginas ?? ''}</td>
        <td>${l.fecha_publicacion ? l.fecha_publicacion.substring(0,10) : ''}</td>
        <td>${l.editorial ?? ''}</td>
        <td>
          <button class="btn-accion btn-editar" data-id="${l.id_libro}">Editar</button>
        </td>
      `;
      tablaBody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

// --- Eventos buscador ---
btnBuscar.addEventListener('click', () => {
  const q = searchInput.value.trim();
  cargarLibros(q);
});

btnLimpiar.addEventListener('click', () => {
  searchInput.value = '';
  cargarLibros();
});

searchInput.addEventListener('keyup', e => {
  if (e.key === 'Enter') btnBuscar.click();
});

// --- Form autor + libro (un solo botón) ---
formAutorLibro.addEventListener('submit', async e => {
  e.preventDefault();

  const nombre = nuevoAutorNombre.value.trim();
  const apellidos = nuevoAutorApellidos.value.trim();
  const titulo = nuevoTitulo.value.trim();
  const paginas = nuevoPaginas.value ? Number(nuevoPaginas.value) : null;
  const fecha_publicacion = nuevoFecha.value || null;
  const editorial = nuevoEditorial.value.trim() || null;

  if (!nombre || !apellidos || !titulo) {
    mostrarMensaje('Nombre, apellidos y título son obligatorios', 'error');
    return;
  }

  try {
    // 1) Crear autor
    const resAutor = await fetch(`${API_BASE}/autores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellidos })
    });

    if (!resAutor.ok) throw new Error('Error al crear autor');
    const autorData = await resAutor.json();
    const id_autor = autorData.id_autor;

    // 2) Crear libro usando ese autor
    const resLibro = await fetch(`${API_BASE}/libros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo,
        paginas,
        fecha_publicacion,
        editorial,
        id_autor
      })
    });

    if (!resLibro.ok) throw new Error('Error al crear libro');

    mostrarMensaje('Autor y libro guardados correctamente');
    formAutorLibro.reset();
    // refrescar listado si vuelves a la vista
    cargarLibros();
  } catch (err) {
    console.error(err);
    mostrarMensaje('Ocurrió un error al guardar', 'error');
  }
});

// --- Click en botón Editar (delegación) ---
tablaBody.addEventListener('click', async e => {
  const btn = e.target.closest('.btn-editar');
  if (!btn) return;

  const id = btn.getAttribute('data-id');

  // Cargar datos del libro seleccionado desde la lista actual
  const tr = btn.closest('tr');
  const celdas = tr.querySelectorAll('td');

  editIdLibro.value = id;
  editTitulo.value = celdas[1].textContent;
  editPaginas.value = celdas[3].textContent || '';
  editFecha.value = celdas[4].textContent || '';
  editEditorial.value = celdas[5].textContent || '';

  await cargarAutoresEdicion();
  panelEditar.style.display = 'block';
});

// Cancelar edición
btnCancelarEdicion.addEventListener('click', () => {
  panelEditar.style.display = 'none';
});

// Guardar edición
formEditarLibro.addEventListener('submit', async e => {
  e.preventDefault();

  const id = editIdLibro.value;
  const data = {
    titulo: editTitulo.value.trim(),
    paginas: editPaginas.value ? Number(editPaginas.value) : null,
    fecha_publicacion: editFecha.value || null,
    editorial: editEditorial.value.trim() || null,
    id_autor: Number(editAutor.value)
  };

  if (!data.titulo || !data.id_autor) {
    alert('Título y autor son obligatorios');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/libros/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Error al actualizar libro');

    panelEditar.style.display = 'none';
    await cargarLibros(searchInput.value.trim());
  } catch (err) {
    console.error(err);
    alert('Error al guardar cambios');
  }
});

// --- inicialización ---
cargarLibros();
