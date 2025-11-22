// db.js
const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',      
  database: 'Libros' // nombre de tu base de datos
});

conexion.connect(err => {
  if (err) {
    console.log('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos Libros.');
  }
});

// exportamos la conexión para otros archivos
module.exports = conexion;
