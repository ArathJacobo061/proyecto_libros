// insertHora.js
const conexionRegistro = require('./dbRegistro');

// Coordenadas que ya te dio ipwho.is:
const lat = 24.8090649;
const lon = -107.3940117;

const url = `https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    const hora = data.time; // ej. "17:16:20"
    console.log('Hora obtenida de la API:', hora);

    const query = 'INSERT INTO horas (latitud, longitud, hora) VALUES (?, ?, ?)';

    conexionRegistro.query(query, [lat, lon, hora], (err, resultado) => {
      if (err) {
        console.log('Error al insertar datos:', err.message);
      } else {
        console.log('Registro insertado correctamente. ID:', resultado.insertId);
      }
      conexionRegistro.end();
    });
  })
  .catch(err => console.log('Error al obtener hora:', err));
