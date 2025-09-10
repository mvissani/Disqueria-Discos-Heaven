// Constantes
const express = require("express");
const router = express.Router();
const pool = require("../database/discos-database");
const { authMiddleware } = require("../middlewares/authUsers");

// Obtener favoritos
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const [favoritos] = await pool.query(
      `SELECT d.* 
       FROM discos d
       JOIN favoritos f ON d.id = f.disco_id
       WHERE f.usuario_id = ?`,
      [userId]
    );
    res.json(Array.isArray(favoritos) ? favoritos : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// Toggle favorito
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { disco_id } = req.body;
    if (disco_id === undefined || disco_id === null) {
      return res.status(400).json({ error: "Disco no especificado" });  
    }

    const [existe] = await pool.query(
      "SELECT * FROM favoritos WHERE usuario_id = ? AND disco_id = ?",
      [userId, disco_id]
    );

    if (existe.length > 0) {
      await pool.query(
        "DELETE FROM favoritos WHERE usuario_id = ? AND disco_id = ?",
        [userId, disco_id]
      );
      return res.json({ favorito: false, disco_id });
    } else {
      await pool.query(
        "INSERT INTO favoritos (usuario_id, disco_id) VALUES (?, ?)",
        [userId, disco_id]
      );
      return res.json({ favorito: true, disco_id });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar favorito" });
  }
});

// Exporto el modulo
module.exports = router;
