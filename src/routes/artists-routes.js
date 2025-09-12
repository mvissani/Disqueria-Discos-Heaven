// Constantes
const express = require("express");
const connection = require("../database/discos-database");
const router = express.Router();

// Todos los artistas (únicos)
router.get("/", async (req, res) => {
  try {
    const [discos] = await connection.query("SELECT artista, slug_art, img_artista FROM discos");
    
    const artistasMap = new Map();
    discos.forEach(disco => {
      if (!artistasMap.has(disco.artista)) {
        artistasMap.set(disco.artista, {
          nombre: disco.artista,
          slug: disco.slug_art,
          img: disco.img_artista
        });
      }
    });

    const artistas = Array.from(artistasMap.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
    );

    res.json(artistas);
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Artista por slug con sus discos y canciones
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const [discos] = await connection.query("SELECT * FROM discos WHERE slug_art = ?", [slug]);

    if (discos.length === 0) return res.status(404).json({ error: "Artista no encontrado" });

    // Traer canciones de cada disco
    for (const disco of discos) {
      const [canciones] = await connection.query(
        "SELECT titulo FROM canciones WHERE disco_id = ? ORDER BY id ASC",
        [disco.id]
      );
      disco.canciones_detalle = canciones;
    }

    res.json({ artista: discos[0].artista, discos });
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
