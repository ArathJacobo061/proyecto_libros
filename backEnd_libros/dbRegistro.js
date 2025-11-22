// dbRegistro.js
const mysql = require('mysql2');

const conexionRegistro = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',     
  database: 'Registro'
});

conexionRegistro.connect(err => {
  if (err) {
    console.log('Error al conectar con Registro:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos Registro.');
  }
});

module.exports = conexionRegistro;
