// getTodosLibros.js
const conexion = require('./db');

const query = 'SELECT * FROM Libros';

conexion.query(query, (err, resultados) => {
  if (err) {
    console.log('Error al obtener los libros:', err.message);
  } else {
    console.log('Lista de libros:');
    console.log(resultados);
  }

  conexion.end();
});
