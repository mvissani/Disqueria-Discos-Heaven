// Constantes
const express = require("express");
const { registerUser, loginUser } = require("../controllers/user-controllers");
const { authMiddleware, checkRole } = require("../middlewares/authUsers");
const pool = require("../database/discos-database"); 

const router = express.Router();

// Registro y login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Perfil usuario logueado
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, apellido, email, rol FROM usuarios WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    // Devuelve usuario completo
    res.json(rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});


// Ruta admin
router.get("/admin", authMiddleware, checkRole("admin"), (req, res) => {
  res.json({ msg: "Bienvenido Admin" });
});

module.exports = router;
