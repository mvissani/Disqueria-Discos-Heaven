const express = require('express');
const router = express.Router();
const connection = require('../database/discos-database');
const jwt = require('jsonwebtoken');

// Middleware para verificar token
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No autorizado' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

// GET: discos favoritos del usuario logueado
router.get('/me', authMiddleware, async (req, res) => {
  const usuarioId = req.user.id;

  try {
    const [favoritos] = await connection.query(
      `SELECT d.* 
       FROM discos d
       JOIN favoritos f ON d.id = f.disco_id
       WHERE f.usuario_id = ?`,
      [usuarioId]
    );

    res.json(Array.isArray(favoritos) ? favoritos : []);
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// POST: toggle favorito
router.post('/', authMiddleware, async (req, res) => {
  const usuarioId = req.user.id;
  const { disco_id } = req.body;
  console.log('Body recibido:', req.body); // <-- Agrega este log

  if (disco_id === undefined || disco_id === null) {
    return res.status(400).json({ error: "Disco no especificado" });
  }

  try {
    const [existe] = await connection.query(
      `SELECT * FROM favoritos WHERE usuario_id = ? AND disco_id = ?`,
      [usuarioId, disco_id]
    );

    if (existe.length > 0) {
      await connection.query(
        `DELETE FROM favoritos WHERE usuario_id = ? AND disco_id = ?`,
        [usuarioId, disco_id]
      );
      res.json({ favorito: false, disco_id });
    } else {
      await connection.query(
        `INSERT INTO favoritos (usuario_id, disco_id) VALUES (?, ?)`,
        [usuarioId, disco_id]
      );
      res.json({ favorito: true, disco_id });
    }
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: "Error al actualizar favorito" });
  }
});

module.exports = router;
