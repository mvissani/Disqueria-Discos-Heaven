// Constantes
const express = require("express");
const { loginUser, registerUser } = require("../controllers/user-controllers");
const { authMiddleware, checkRole } = require("../middlewares/auth");
const bcrypt = require("bcryptjs");
const pool = require("../database/discos-database");

const router = express.Router();

// RUTAS PÚBLICAS
router.post("/register", registerUser); 
router.post("/login", loginUser);       

// RUTAS PROTEGIDAS
router.get("/perfil", authMiddleware, (req, res) => {
  res.json({ message: `Hola ${req.user.nombre}, tu rol es ${req.user.rol}` });
});

// RUTA SOLO PARA ADMIN
router.get("/admin", authMiddleware, checkRole("admin"), (req, res) => {
  res.json({ message: "Bienvenido Admin" });
});

// Traer datos del usuario (sin contraseña)
router.get("/me", async (req, res) => {
  try {
    const email = req.query.email;
    const [rows] = await pool.query(
      "SELECT id, nombre, apellido, email FROM usuarios WHERE email = ?",
      [email]
    );
    if (rows.length === 0) return res.status(404).json({ msg: "Usuario no encontrado." });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener usuario." });
  }
});

// Actualizar usuario (con validación de contraseña actual)
router.put("/me", async (req, res) => {
  try {
    const { id, nombre, apellido, email, password, newpassword } = req.body;

    // Buscar usuario actual
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ msg: "Usuario no encontrado." });

    const usuario = rows[0];

    // Verificar contraseña actual
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ msg: "La contraseña actual no es correcta." });
    }

    // Si hay nueva contraseña, la encriptamos
    let hashedPassword = usuario.password; // dejamos la actual
    if (newpassword && newpassword.trim() !== "") {
      hashedPassword = await bcrypt.hash(newpassword, 10);
    }

    // Actualizar usuario
    await pool.query(
      "UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, password = ? WHERE id = ?",
      [nombre, apellido, email, hashedPassword, id]
    );

    res.json({ msg: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar usuario" });
  }
});

module.exports = router;
