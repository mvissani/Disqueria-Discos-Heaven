// Cargar variables de entorno
const mysql = require("mysql2");
const dotenv = require("dotenv");
const path = require("path");

// Detectar entorno
const target = (process.argv[2] || "local").toLowerCase();
const envFile = target === "railway" ? "../../.env.railway" : "../../.env.local";
dotenv.config({ path: path.join(__dirname, envFile) });

// Variables de conexión
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DB
} = process.env;

// Crear pool de conexiones
const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify para usar async/await
const connection = pool.promise();

// Test de conexión al iniciar
connection.getConnection()
  .then(conn => {
    console.log("Conexion exitosa a MySQL!");
    conn.release();
  })
  .catch(err => {
    console.error("Error conectando a MySQL:", err.message);
  });

module.exports = connection;
