// Constantes 
const { exec } = require("child_process");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs-extra");
const cron = require("node-cron");

// Reviso si es railway para pasar la direccion del archivo, y sino, voy a al env local
const target = (process.argv[2] || "local").toLowerCase();
const envFile = target === "railway" ? "../../.env.railway" : "../../.env.local";
dotenv.config({ path: path.join(__dirname, envFile) });

// Variables de entorno de la base de datos y los back ups
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DB,
  BACKUP_DIR = "../../backups",
  MAX_BACKUPS = 10,
  CRON = "0 * * * *",
  MYSQLDUMP_BIN
} = process.env;

// Ruta del mysqldump
const mysqldumpBin = MYSQLDUMP_BIN ? `"${MYSQLDUMP_BIN}"` : "mysqldump";

// Carpeta de backups
const backupDirAbs = path.isAbsolute(BACKUP_DIR) ? BACKUP_DIR : path.join(__dirname, BACKUP_DIR);
fs.ensureDirSync(backupDirAbs);

// Guardo la fecha y hora del evento para nombrar el archivo
function nowStamp() {
  return new Date().toISOString().replace(/[-:T]/g, "_").split(".")[0];
}

// Funcion principal del back up
function makeBackup() {
  const backupFile = path.join(backupDirAbs, `backup_${target}_${nowStamp()}.sql`);

  const options = [
    `-h "${MYSQL_HOST}"`,
    `-P "${MYSQL_PORT}"`,
    `-u "${MYSQL_USER}"`,
    `--password="${MYSQL_PASSWORD}"`,
    `"${MYSQL_DB}"`
  ].join(" ");

  const dumpCommand = `${mysqldumpBin} ${options} > "${backupFile}"`;

  console.log(`Ejecutando back up, por favor espere... → ${backupFile}`);
  exec(dumpCommand, (error, stdout, stderr) => {
    if (error) console.error("Error en la generacion del back up:", error.message);
    if (stderr && !stderr.toLowerCase().includes("warning")) console.warn("Advertencia:", stderr);
    console.log(`Back up generado de forma exitosa: ${backupFile}`);
    cleanOldBackups();
  });
}

// Limpieza de backups viejos
function cleanOldBackups() {
  const files = fs.readdirSync(backupDirAbs)
    .filter(f => f.endsWith(".sql"))
    .map(f => ({ name: f, time: fs.statSync(path.join(backupDirAbs, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);

  const max = Number(MAX_BACKUPS);
  if (files.length > max) {
    const toDelete = files.slice(max);
    toDelete.forEach(file => fs.removeSync(path.join(backupDirAbs, file.name)) && console.log(`Back up viejo eliminado de forma exitosa: ${file.name}`));
  }
}

// Backup inmediato al iniciar
makeBackup();

// Programar back ups automaticos según CRON
cron.schedule(CRON, () => {
  console.log("Ejecutando backup automatico, por favor espere…");
  makeBackup();
});

console.log(`Auto back up activo para "${target}"... guardando en "${backupDirAbs}"`);
