// Cargar variables de entorno
require("dotenv").config(); 

// Constantes
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
// Base de datos
const connection = require("./database/discos-database"); 
// Livereload
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
// Routers
const indexRouter = require("./routes/index-routes");
const usersRouter = require("./routes/users-routes"); 
const adminRouter = require("./routes/admin-routes");
const aboutusRouter = require("./routes/aboutus-routes");
const favoritesRouter = require("./routes/favorites-route");
const myordersRouter = require("./routes/myorders-route");

// Express
const app = express();

// VISTAS
app.set("views", path.resolve(__dirname, "./src/views"));

// Archivos estáticos
app.use(express.static(path.resolve(__dirname, "./public")));

// URL ENCODE / JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

// SERVIDOR LIVERELOAD
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "views")); 
app.use(connectLivereload());

// RUTAS
// Todos los discos con paginación
// GET /cds?page=1&limit=8
app.get("/cds", async (req, res) => {
  const page = parseInt(req.query.page) || 1;      
  const limit = parseInt(req.query.limit) || 8;    
  const offset = (page - 1) * limit;

  try {
    // Contar total de discos
    const [totalRows] = await connection.query("SELECT COUNT(*) as total FROM discos");
    const total = totalRows[0].total;

    // Traer discos paginados
    const [results] = await connection.query(
      "SELECT * FROM discos ORDER BY titulo ASC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.json({
      discos: results,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Discos con descuento
app.get("/cds/offers", async (req, res) => {
  try {
    const [results] = await connection.query(
      `SELECT * FROM discos WHERE descuento > 0 ORDER BY titulo ASC`
    );
    res.json(results);
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Discos recomendados
app.get("/cds/recommendations", async (req, res) => {
  try {
    const [results] = await connection.query(
      `SELECT * FROM discos WHERE recomendado = 1 ORDER BY titulo ASC`
    );
    res.json(results);
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Discos populares
app.get("/cds/popular", async (req, res) => {
  try {
    const [results] = await connection.query(
      `SELECT * FROM discos WHERE mas_vendido = 1 ORDER BY titulo ASC`
    );
    res.json(results);
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Disco por slug con canciones
app.get("/api/cd/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const [discos] = await connection.query("SELECT * FROM discos WHERE slug = ?", [slug]);
    if (discos.length === 0) return res.status(404).json({ error: "Disco no encontrado" });

    const disco = discos[0];

    const [canciones] = await connection.query(
      "SELECT titulo FROM canciones WHERE disco_id = ? ORDER BY id ASC",
      [disco.id]
    );

    disco.canciones_detalle = canciones;

    res.json(disco);
  } catch (err) {
    console.error("Error en MySQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Favoritos
app.get("/my-favorites", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "myfavorites.html"));
});

// Mis Compras
app.get("/my-orders", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "myorders.html"));
});

// API de ordenes
app.use("/api/myorders", myordersRouter);

// API de favoritos
app.use("/api/favorites", favoritesRouter);

// OTROS ROUTERS
app.use("/", indexRouter);
app.use("/users", usersRouter); 
app.use("/admin", adminRouter);
app.use("/aboutus", aboutusRouter);

// ERRORES
app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err.message);
  res.status(500).json({ error: "Error interno en el servidor" });
});

// SERVIDOR 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}!`);
});
