// Constantes
const express = require("express");
const connection = require("../database/discos-database");
const { authMiddleware, checkRole } = require("../middlewares/auth");
const router = express.Router();

// Crear un disco nuevo (solo admin)
router.post("/cds", authMiddleware, checkRole("admin"), async (req, res) => {
  const { titulo, descripcion } = req.body;

  try {
    await connection.query(
      "INSERT INTO discos (titulo, descripcion) VALUES (?, ?)",
      [titulo, descripcion]
    );
    res.send("Disco creado correctamente!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear disco.");
  }
});

// Exportar modulo
module.exports = router;
