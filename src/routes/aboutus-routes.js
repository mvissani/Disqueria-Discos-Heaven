// Constantes
const express = require("express");
const { body, validationResult } = require("express-validator");

const router = express.Router();

router.post("/about-us", [
  body("email").isEmail().withMessage("Debe ser un email válido."),
  body("asunto").isLength({ min: 3 }).withMessage("El asunto es muy corto."),
  body("consulta").isLength({ min: 10 }).withMessage("La consulta es muy corta.")
], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  res.json({ message: "Consulta recibida correctamente." });
});

module.exports = router;
