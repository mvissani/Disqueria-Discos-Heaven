// Constantes
const pool = require("../database/discos-database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registro
const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    const [existing] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ msg: "Email ya registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES (?, ?, ?, ?, ?)", [nombre, apellido, email, hashedPassword, "user"]);

    res.json({ msg: "Usuario registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al registrar usuario" });
  }
};

// Iniciar Sesion
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ msg: "Email o contraseña incorrecta" });

    const usuario = rows[0];
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) return res.status(400).json({ msg: "Email o contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al iniciar sesión" });
  }
};

module.exports = { registerUser, loginUser };
