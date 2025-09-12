// Constantes
const express = require("express");
const connection = require("../database/discos-database");
const router = express.Router();

// Todos los discos
router.get("/", async (req, res) => {
  try {
    const [results] = await connection.query("SELECT * FROM discos ORDER BY titulo ASC");
    res.json(Array.isArray(results) ? results : []);
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Discos con descuento
router.get("/offers", async (req, res) => {
  try {
    const [results] = await connection.query(
      "SELECT * FROM discos WHERE descuento > 0 ORDER BY titulo ASC"
    );
    res.json(results);
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Discos recomendados
router.get("/recommendations", async (req, res) => {
  try {
    const [results] = await connection.query(
      "SELECT * FROM discos WHERE recomendado = 1 ORDER BY titulo ASC"
    );
    res.json(results);
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Discos populares
router.get("/popular", async (req, res) => {
  try {
    const [results] = await connection.query(
      "SELECT * FROM discos WHERE mas_vendido = 1 ORDER BY titulo ASC"
    );
    res.json(results);
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Disco por slug con canciones
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const [discos] = await connection.query("SELECT * FROM discos WHERE slug = ?", [slug]);
    if (discos.length === 0) return res.status(404).json({ error: "Disco no encontrado" });

    const disco = discos[0];

    const [canciones] = await connection.query(
      "SELECT titulo FROM canciones WHERE disco_id = ? ORDER BY id ASC",
      [disco.id]
    );

    disco.canciones_detalle = canciones;

    res.json(disco);
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
