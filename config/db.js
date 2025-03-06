// config/database.js

require('dotenv').config(); // Carga las variables de entorno desde un archivo .env

const mysql = require('mysql2'); // Importa el módulo mysql2 para manejar la base de datos

// Crea una conexión a la base de datos con soporte de promesas
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // Host de la base de datos (definido en .env)
  user: process.env.DB_USER,       // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña del usuario
  database: process.env.DB_NAME    // Nombre de la base de datos
}).promise(); // Permite el uso de promesas en lugar de callbacks

// Conecta la base de datos y maneja posibles errores
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

module.exports = db; // Exporta la conexión para ser utilizada en otros archivos
