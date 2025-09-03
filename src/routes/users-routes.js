// src/routes/users-routes.js
const express = require("express");
const { loginUser, registerUser } = require("../controllers/user-controllers");
const { authMiddleware, checkRole } = require("../middlewares/auth");

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

module.exports = router;
