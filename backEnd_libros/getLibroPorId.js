// getLibroPorId.js
const conexion = require('./db');

const idBuscado = 5; // cambia el número si quieres probar otro ID

const query = 'SELECT * FROM Libros WHERE id_libro = ?';

conexion.query(query, [idBuscado], (err, resultados) => {
  if (err) {
    console.log('Error al obtener el libro:', err.message);
  } else {
    if (resultados.length > 0) {
      const libro = resultados[0];
      console.log('Libro encontrado:');
      console.log('ID:', libro.id_libro);
      console.log('Título:', libro.titulo);
      console.log('Páginas:', libro.paginas);
      console.log('Fecha de publicación:', libro.fecha_publicacion);
      console.log('Editorial:', libro.editorial);
    } else {
      console.log('No se encontró un libro con ese ID.');
    }
  }

  conexion.end();
});
