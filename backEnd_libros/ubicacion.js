// ubicacion.js

fetch("https://ipwho.is/")
  .then(res => res.json())
  .then(data => {
    console.log("Datos completos:", data);
    console.log("Latitud:", data.latitude);
    console.log("Longitud:", data.longitude);
  })
  .catch(err => console.log("Error:", err));

