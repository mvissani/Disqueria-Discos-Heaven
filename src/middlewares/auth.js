// Constantes
const jwt = require("jsonwebtoken");

// Funcion para autenticar el token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  // Para verificar por consola que los datos sean correctos
  console.log("Auth header recibido:", authHeader);
  console.log("Token extraído:", token);
  console.log("JWT_SECRET backend:", process.env.JWT_SECRET); 

  if (!token) return res.status(401).json({ error: "No autorizado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Error JWT:", err.message);
      return res.status(401).json({ error: "Token inválido" });
    }
    req.user = user;
    next();
  });
}

// Exporto el modulo
module.exports = authenticateToken;
