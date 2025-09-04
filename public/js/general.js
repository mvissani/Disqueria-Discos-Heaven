// Variables globales
window.discos = [];
window.carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Fetch de discos
fetch("/cds")
  .then(res => res.json())
  .then(data => {
    window.discos = data;
    window.discos.forEach(disco => disco.apiUrl = `/api/cd/${disco.id}`);
    const event = new CustomEvent("discosListos", { detail: window.discos });
    window.dispatchEvent(event);
    if (typeof inicializarProductos === "function") inicializarProductos();
  })
  .catch(err => console.error("Error al obtener discos:", err));

// =============================
// Función para actualizar header
// =============================
function actualizarHeaderUsuario() {
  const nombre = sessionStorage.getItem("nombreUsuario");

  // ----- Escritorio -----
  const miCuentaDesktop = document.querySelector(".menu-right .submenu a span.texto");
  const registrarDesktop = document.querySelector(".menu-right .submenu .dropdown a.registrarme");
  const iniciarSesionDesktop = document.querySelector(".menu-right .submenu .dropdown a.iniciar-sesion");
  const comprasDesktop = document.querySelector(".menu-right .submenu a.mis-compras");
  const favoritosDesktop = document.querySelector(".menu-right .submenu a.mis-favoritos");
  const configuracionesDesktop = document.querySelector(".menu-right .submenu a.configuraciones");

  // ----- Móvil -----
  const iniciarSesionMobile = document.querySelector(".menuMobile a.iniciarsesion");
  const registrarMobile = document.querySelector(".menuMobile a.registro");
  const comprasMobile = document.querySelector(".menuMobile a.compras");
  const favoritosMobile = document.querySelector(".menuMobile a.favoritos");
  const configuracionesMobile = document.querySelector(".menuMobile a.configuraciones");

  if (nombre) {
    // --- Escritorio ---
    if (miCuentaDesktop) miCuentaDesktop.textContent = nombre;
    if (registrarDesktop) registrarDesktop.style.display = "none";
    if (iniciarSesionDesktop) {
      iniciarSesionDesktop.textContent = "Cerrar Sesión";
      iniciarSesionDesktop.href = "#";
      iniciarSesionDesktop.onclick = () => { sessionStorage.clear(); window.location.reload(); };
    }
    [comprasDesktop, favoritosDesktop, configuracionesDesktop].forEach(el => { if (el) el.style.display = ""; });

    // --- Móvil ---
    if (registrarMobile) registrarMobile.style.display = "none";
    if (iniciarSesionMobile) {
      const spanTexto = iniciarSesionMobile.querySelector(".texto");
      if (spanTexto) spanTexto.textContent = "Cerrar Sesión";
      iniciarSesionMobile.href = "#";
      iniciarSesionMobile.onclick = () => { sessionStorage.clear(); window.location.reload(); };
    }
    [comprasMobile, favoritosMobile, configuracionesMobile].forEach(el => { if (el) el.style.display = ""; });

  } else {
    // --- Escritorio ---
    if (miCuentaDesktop) miCuentaDesktop.textContent = "Mi Cuenta";
    if (registrarDesktop) registrarDesktop.style.display = "";
    if (iniciarSesionDesktop) {
      iniciarSesionDesktop.textContent = "Iniciar Sesión";
      iniciarSesionDesktop.href = "/log-in";
      iniciarSesionDesktop.onclick = null;
    }
    [comprasDesktop, favoritosDesktop, configuracionesDesktop].forEach(el => { if (el) el.style.display = "none"; });

    // --- Móvil ---
    if (registrarMobile) registrarMobile.style.display = "";
    if (iniciarSesionMobile) {
      const spanTexto = iniciarSesionMobile.querySelector(".texto");
      if (spanTexto) spanTexto.textContent = "Iniciar Sesión";
      iniciarSesionMobile.href = "/log-in";
      iniciarSesionMobile.onclick = null;
    }
    [comprasMobile, favoritosMobile, configuracionesMobile].forEach(el => { if (el) el.style.display = "none"; });
  }
}

// =============================
// DOMContentLoaded
// =============================
document.addEventListener("DOMContentLoaded", () => {
  actualizarHeaderUsuario();

  // ----- Menú Hamburguesa -----
  const menuToggle = document.getElementById("menuToggle");
  const menuMobile = document.querySelector(".menuMobile");
  const menuClose = document.getElementById("menuClose");

  if (menuToggle && menuMobile) menuToggle.addEventListener("click", () => menuMobile.classList.add("active"));
  if (menuClose && menuMobile) menuClose.addEventListener("click", () => menuMobile.classList.remove("active"));

  // ----- Carrito Móvil -----
  const carritoBtnMobile = document.getElementById("carritoBtnMobile");
  const carritoModalMobile = document.getElementById("carritoMobile");
  const cerrarCarritoMobile = document.getElementById("cerrarCarritoMobile");

  if (carritoBtnMobile && carritoModalMobile && cerrarCarritoMobile) {
    carritoBtnMobile.addEventListener("click", e => { e.preventDefault(); carritoModalMobile.style.display = "flex"; });
    cerrarCarritoMobile.addEventListener("click", () => carritoModalMobile.style.display = "none");
    carritoModalMobile.addEventListener("click", e => { if (e.target === carritoModalMobile) carritoModalMobile.style.display = "none"; });
  }

  // ----- Carrito Escritorio -----
  const carritoBtn = document.getElementById("carritoBtn");
  const carritoModal = document.getElementById("carrito");
  const cerrarCarrito = document.getElementById("cerrarCarrito");

  if (carritoBtn && carritoModal && cerrarCarrito) {
    carritoBtn.addEventListener("click", e => { e.preventDefault(); carritoModal.style.display = "flex"; });
    cerrarCarrito.addEventListener("click", () => carritoModal.style.display = "none");
    carritoModal.addEventListener("click", e => { if (e.target === carritoModal) carritoModal.style.display = "none"; });
  }

  // ----- Resize -----
  window.addEventListener("resize", () => { if (window.innerWidth > 768 && menuMobile) menuMobile.classList.remove("active"); });
});