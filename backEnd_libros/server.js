// backEnd_libros/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const conexion = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Servir la carpeta del frontend
app.use(express.static(path.join(__dirname, '../frontEnd_libros')));

// --- RUTAS API ---

// GET /api/autores
app.get('/api/autores', (req, res) => {
  const sql = 'SELECT * FROM Autores ORDER BY apellidos, nombre';

  conexion.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener autores' });
    }
    res.json(rows);
  });
});

// GET /api/libros  (con búsqueda opcional ?q=)
app.get('/api/libros', (req, res) => {
  const { q } = req.query;

  let sql = `
    SELECT l.id_libro, l.titulo, l.paginas, l.fecha_publicacion,
           l.editorial, a.id_autor, a.nombre, a.apellidos
    FROM Libros l
    JOIN Autores a ON l.id_autor = a.id_autor
  `;
  const params = [];

  if (q) {
    sql += ` WHERE l.titulo LIKE ? OR a.nombre LIKE ? OR a.apellidos LIKE ?`;
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  sql += ' ORDER BY l.id_libro DESC';

  conexion.query(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener libros' });
    }
    res.json(rows);
  });
});

// POST /api/autores
app.post('/api/autores', (req, res) => {
  const { nombre, apellidos } = req.body;

  if (!nombre || !apellidos) {
    return res.status(400).json({ error: 'Nombre y apellidos son obligatorios' });
  }

  const sql = 'INSERT INTO Autores (nombre, apellidos) VALUES (?, ?)';

  conexion.query(sql, [nombre, apellidos], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al crear autor' });
    }
    res.status(201).json({ id_autor: result.insertId, nombre, apellidos });
  });
});

// POST /api/libros
app.post('/api/libros', (req, res) => {
  const { titulo, paginas, fecha_publicacion, editorial, id_autor } = req.body;

  if (!titulo || !id_autor) {
    return res.status(400).json({ error: 'Título e id_autor son obligatorios' });
  }

  const sql = `
    INSERT INTO Libros (titulo, paginas, fecha_publicacion, editorial, id_autor)
    VALUES (?, ?, ?, ?, ?)
  `;

  conexion.query(
    sql,
    [titulo, paginas || null, fecha_publicacion || null, editorial || null, id_autor],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al crear libro' });
      }
      res.status(201).json({
        id_libro: result.insertId,
        titulo,
        paginas,
        fecha_publicacion,
        editorial,
        id_autor
      });
    }
  );
});

// --- LEVANTAR SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
// PUT /api/libros/:id -> editar libro
app.put('/api/libros/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, paginas, fecha_publicacion, editorial, id_autor } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE Libros
       SET titulo = ?, paginas = ?, fecha_publicacion = ?, editorial = ?, id_autor = ?
       WHERE id_libro = ?`,
      [titulo, paginas || null, fecha_publicacion || null, editorial || null, id_autor, id]
    );

    res.json({ ok: true, affectedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar libro' });
  }
});
