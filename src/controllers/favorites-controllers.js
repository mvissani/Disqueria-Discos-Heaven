const pool = require("../database/discos-database");

// Toggle favorito (requiere usuario_id en body)
async function toggleFavorite(req, res) {
  const { usuario_id, disco_id } = req.body;

  if (!usuario_id) return res.status(400).json({ error: "usuario_id requerido" });
  if (!disco_id) return res.status(400).json({ error: "disco_id requerido" });

  try {
    const [existe] = await pool.query(
      "SELECT * FROM favoritos WHERE usuario_id = ? AND disco_id = ?",
      [usuario_id, disco_id]
    );

    if (existe.length > 0) {
      // eliminar favorito
      await pool.query(
        "DELETE FROM favoritos WHERE usuario_id = ? AND disco_id = ?",
        [usuario_id, disco_id]
      );
      return res.json({ favorito: false });
    } else {
      // agregar favorito
      await pool.query(
        "INSERT INTO favoritos (usuario_id, disco_id) VALUES (?, ?)",
        [usuario_id, disco_id]
      );
      return res.json({ favorito: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al actualizar favoritos" });
  }
}

// Obtener favoritos del usuario (requiere usuario_id en body)
async function getFavorites(req, res) {
  const { usuario_id } = req.body;
  if (!usuario_id) return res.status(400).json({ error: "usuario_id requerido" });

  try {
    const [favoritos] = await pool.query(
      `SELECT d.id, d.titulo, d.artista, d.img, d.slug
       FROM favoritos f
       JOIN discos d ON f.disco_id = d.id
       WHERE f.usuario_id = ?`,
      [usuario_id]
    );

    res.json(favoritos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
}

module.exports = { toggleFavorite, getFavorites };
