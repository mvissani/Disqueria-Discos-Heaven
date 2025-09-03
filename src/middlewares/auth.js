const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Token requerido");

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Token inválido");
    req.user = user;
    next();
  });
}

function checkRole(role) {
  return (req, res, next) => {
    if (req.user.rol !== role) return res.status(403).send("No tienes permisos");
    next();
  };
}

module.exports = { authMiddleware, checkRole };
