// hora.js

const lat = 24.8090649;
const lon = -107.3940117;

const url = `https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("JSON completo:", data);
    console.log("Fecha:", data.date);
    console.log("Hora local:", data.time);
  })
  .catch(err => console.log("Error al obtener hora:", err));

