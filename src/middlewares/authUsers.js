// Constantes
const jwt = require("jsonwebtoken");

// Funcion para autenticar los permisos de los usuarios
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
};

// Funcion para revisar el rol del usuario
const checkRole = (rol) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "No autorizado" });
  if (req.user.rol !== rol) return res.status(403).json({ error: "Acceso denegado" });
  next();
};

// Exporto el modulo
module.exports = { authMiddleware, checkRole };
