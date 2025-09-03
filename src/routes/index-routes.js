// Constantes

const express = require("express")
const router = express.Router()
const path = require("path")

router.use(express.static("public"))

// Rutas

// Home
router.get("/", (req, res) =>
{
res.sendFile(path.join(__dirname, "../views/home.html"));
})

// Register
router.get("/register", (req, res) =>
{
res.sendFile(path.join(__dirname, "../views/register.html"));
})

// Log In
router.get("/log-in", (req, res) =>
{
res.sendFile(path.join(__dirname, "../views/login.html"));
})

// Products
router.get("/products", (req, res) =>
{
res.sendFile(path.join(__dirname, "../views/products.html"));
})

// Sales
router.get("/sales", (req, res) =>
{
res.sendFile(path.join(__dirname, "../views/sales.html"));
})

// Configurations
router.get("/configurations", (req, res) =>
{
res.sendFile(path.join(__dirname, "../views/configurations.html"));
})

// Popular
router.get("/popular", (req, res) =>
{
res.sendFile(path.join(__dirname, "../views/popular.html"));
})

// Recommendations
router.get("/recommendations", (req, res) =>
{
res.sendFile(path.join(__dirname, "../views/recommendations.html"));
})

// Cd
router.get("/cd/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/cd.html"));
});

// About Us
router.get("/about-us", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/aboutus.html"));
});

// Help
router.get("/help", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/help.html"));
});

// Contact
router.get("/contact-us", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/contactus.html"));
});

// Exportar modulo
module.exports = router