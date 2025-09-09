const express = require("express");
const router = express.Router();
const { toggleFavorite, getFavorites } = require("../controllers/favorites-controllers");

// Agregar/eliminar favorito
router.post("/", toggleFavorite);

// Obtener favoritos del usuario (POST con usuario_id)
router.post("/me", getFavorites);

module.exports = router;
