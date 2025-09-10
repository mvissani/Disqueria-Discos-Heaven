// Constantes
const express = require("express");
const router = express.Router();
const connection = require("../database/discos-database");
const jwt = require("jsonwebtoken");

// Middleware para verificar token
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}

// Crear nuevas compras
router.post("/", authMiddleware, async (req, res) => {
  const usuarioId = req.user.id;
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No se recibieron items para la compra." });
  }

  try {
    for (const item of items) {
      if (item.id === undefined || item.id === null ||
        item.cantidad === undefined || item.cantidad === null ||
        item.precio === undefined || item.precio === null) {
        return res.status(400).json({ error: "Cada item debe tener id, cantidad y precio." });
      }

      await connection.query(
        "INSERT INTO compras (usuario_id, disco_id, cantidad, precio, fecha) VALUES (?, ?, ?, ?, NOW())",
        [usuarioId, item.id, item.cantidad, item.precio]
      );
    }

    return res.json({ success: true, message: "Compra registrada correctamente." });
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    return res.status(500).json({ error: "Error al crear la compra." });
  }
});

// Obtener compras del usuario
router.get("/me", authMiddleware, async (req, res) => {
  const usuarioId = req.user.id;

  try {
    const [rows] = await connection.query(
      `SELECT c.id, c.usuario_id, c.disco_id, c.cantidad, c.precio, c.fecha,
              d.titulo, d.artista, d.slug
       FROM compras c
       JOIN discos d ON c.disco_id = d.id
       WHERE c.usuario_id = ?
       ORDER BY c.fecha DESC`,
      [usuarioId]
    );

    const comprasMap = new Map();
    rows.forEach(row => {
      const key = row.fecha.toISOString();
      if (!comprasMap.has(key)) {
        comprasMap.set(key, { fecha: row.fecha, items: [] });
      }
      comprasMap.get(key).items.push({
        titulo: row.titulo,
        artista: row.artista,
        slug: row.slug,
        cantidad: row.cantidad,
        precio: row.precio
      });
    });

    return res.json(Array.from(comprasMap.values()));
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    return res.status(500).json({ error: "Error al obtener las compras." });
  }
});

// Exporto el modulo
module.exports = router;
