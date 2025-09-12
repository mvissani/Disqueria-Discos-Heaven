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
const favoritesRouter = require("./routes/favorites-routes");
const myordersRouter = require("./routes/myorders-routes");
const productsRouter = require("./routes/products-routes");
const artistsRouter = require("./routes/artists-routes"); 

// Express 
const app = express();

// Vistas 
app.set("views", path.resolve(__dirname, "./src/views"));

// Archivos estáticos 
app.use(express.static(path.resolve(__dirname, "./public")));

// Parseo de requests 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

// Servidor Livereload 
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "src/views")); 
app.use(connectLivereload());

// Rutas HTML 
app.get("/my-favorites", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/myfavorites.html"));
});

app.get("/my-orders", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/myorders.html"));
});

app.get("/artists", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/artists.html"));
});

app.get("/products", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/products.html"));
});

app.get("/products/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/cd.html"));
});

app.get("/artists/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/artist.html"));
});

// Rutas API 
app.use("/api/myorders", myordersRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/products", productsRouter);
app.use("/api/artists", artistsRouter);

// Otros routers 
app.use("/", indexRouter);
app.use("/users", usersRouter); 
app.use("/admin", adminRouter);
app.use("/aboutus", aboutusRouter);

// Manejo de errores 
app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err.message);
  res.status(500).json({ error: "Error interno en el servidor" });
});

// Servidor 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}!`);
});
