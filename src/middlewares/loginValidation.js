export const validarLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Validación básica antes de consultar DB
  if (!email || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios." });
  }

  // Validación formato email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    return res.status(400).json({ message: "El correo no es válido." });
  }

  // Si pasa todas las validaciones → continúa
  next();
};
