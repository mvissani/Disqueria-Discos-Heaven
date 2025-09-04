// Constantes
const pool = require("../database/discos-database"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login recibido:", { email, password });

  if (!email || !password) return res.status(400).json({ error: "Campos vacíos." });

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    console.log("Resultado SELECT login:", rows);

    if (rows.length === 0) return res.status(401).json({ error: "Usuario no encontrado." });

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Contraseña incorrecta." });

    const token = jwt.sign(
      { id: user.id, rol: user.rol, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ 
      token, 
      rol: user.rol, 
      nombre: user.nombre, 
      email: user.email 
    });
  } catch (err) {
    console.error("Error en loginUser:", err);
    res.status(500).json({ error: "Error en login." });
  }
};

// REGISTER
const registerUser = async (req, res) => {
  const { nombre, email, password, apellido } = req.body;

  console.log("Registro recibido:", { nombre, email, password, apellido });

  if (!/^[^@]+@[^@]+$/.test(email)) {
    return res.status(400).send("Email inválido (debe contener solo una @).");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hasheada:", hashedPassword);

    const query = "INSERT INTO usuarios (nombre, email, password, rol, apellido) VALUES (?, ?, ?, ?, ?)";
    const [result] = await pool.query(query, [nombre, email, hashedPassword, "user", apellido]);

    console.log("Resultado del INSERT:", result);

    res.send("Usuario registrado correctamente!");
  } catch (err) {
    console.error("Error en registerUser:", err);
    res.status(500).send("Error al registrar usuario.");
  }
};

module.exports = { loginUser, registerUser };
