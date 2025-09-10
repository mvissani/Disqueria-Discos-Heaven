// Exporto la validacion del inicio de sesion de los usuarios
export const validarLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Validacion basica antes de consultar en la base de datos
  if (!email || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios." });
  }

  // Validacion del formato email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    return res.status(400).json({ message: "El correo no es válido." });
  }

  // Si pasa todas las validaciones, continua
  next();
};
