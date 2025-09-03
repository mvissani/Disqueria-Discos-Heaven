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

// Actualizar header según usuario
function actualizarHeaderUsuario() {
  const nombre = localStorage.getItem("nombreUsuario");

  // Escritorio
  const miCuentaDesktop = document.querySelector(".menu-right .submenu a span.texto");
  const registrarDesktop = document.querySelector(".menu-right .submenu .dropdown a.registrarme");
  const iniciarSesionDesktop = document.querySelector(".menu-right .submenu .dropdown a.iniciar-sesion");

  // Móvil
  const miCuentaMobile = document.querySelector(".menuMobile a span.texto");
  const registrarMobile = document.querySelector(".menuMobile a.registrarme");
  const iniciarSesionMobile = document.querySelector(".menuMobile a.iniciar-sesion");

  if (nombre) {
    // Cambia "Mi Cuenta" por el nombre
    if (miCuentaDesktop) miCuentaDesktop.textContent = nombre;
    if (miCuentaMobile) miCuentaMobile.textContent = nombre;

    // Oculta "Registrarme"
    if (registrarDesktop) registrarDesktop.style.display = "none";
    if (registrarMobile) registrarMobile.style.display = "none";

    // Cambia "Iniciar Sesión" por "Cerrar Sesión"
    if (iniciarSesionDesktop) {
      iniciarSesionDesktop.textContent = "Cerrar Sesión";
      iniciarSesionDesktop.href = "#";
      iniciarSesionDesktop.onclick = () => {
        localStorage.clear();
        window.location.reload();
      };
    }
    if (iniciarSesionMobile) {
      iniciarSesionMobile.textContent = "Cerrar Sesión";
      iniciarSesionMobile.href = "#";
      iniciarSesionMobile.onclick = () => {
        localStorage.clear();
        window.location.reload();
      };
    }
  } else {
    // Si no está logueado, muestra todo normal
    if (miCuentaDesktop) miCuentaDesktop.textContent = "Mi Cuenta";
    if (miCuentaMobile) miCuentaMobile.textContent = "Mi Cuenta";
    if (registrarDesktop) registrarDesktop.style.display = "";
    if (registrarMobile) registrarMobile.style.display = "";
    if (iniciarSesionDesktop) {
      iniciarSesionDesktop.textContent = "Iniciar Sesión";
      iniciarSesionDesktop.href = "/log-in";
      iniciarSesionDesktop.onclick = null;
    }
    if (iniciarSesionMobile) {
      iniciarSesionMobile.textContent = "Iniciar Sesión";
      iniciarSesionMobile.href = "/log-in";
      iniciarSesionMobile.onclick = null;
    }

    // Oculta configuraciones, mis compras y mis favoritos si NO está logueado
    document.querySelectorAll('.configuraciones, .mis-compras, .mis-favoritos').forEach(el => {
      el.style.display = "none";
    });
  }
}

// Menú hamburguesa y carrito
document.addEventListener("DOMContentLoaded", () => {
  actualizarHeaderUsuario();

  const menuToggle = document.getElementById("menuToggle");
  const menuMobile = document.querySelector(".menuMobile");
  const menuClose = document.getElementById("menuClose");

  if (menuToggle && menuMobile) {
    menuToggle.addEventListener("click", () => menuMobile.classList.add("active"));
  }
  if (menuClose && menuMobile) {
    menuClose.addEventListener("click", () => menuMobile.classList.remove("active"));
  }

  // Carrito móvil
  const carritoBtnMobile = document.getElementById("carritoBtnMobile");
  const carritoModalMobile = document.getElementById("carritoMobile");
  const cerrarCarritoMobile = document.getElementById("cerrarCarritoMobile");

  if (carritoBtnMobile && carritoModalMobile && cerrarCarritoMobile) {
    carritoBtnMobile.addEventListener("click", e => {
      e.preventDefault();
      carritoModalMobile.style.display = "flex";
    });
    cerrarCarritoMobile.addEventListener("click", () => carritoModalMobile.style.display = "none");
    carritoModalMobile.addEventListener("click", e => { if (e.target === carritoModalMobile) carritoModalMobile.style.display = "none"; });
  }

  // Carrito escritorio
  const carritoBtn = document.getElementById("carritoBtn");
  const carritoModal = document.getElementById("carrito");
  const cerrarCarrito = document.getElementById("cerrarCarrito");

  if (carritoBtn && carritoModal && cerrarCarrito) {
    carritoBtn.addEventListener("click", e => {
      e.preventDefault();
      carritoModal.style.display = "flex";
    });
    cerrarCarrito.addEventListener("click", () => carritoModal.style.display = "none");
    carritoModal.addEventListener("click", e => { if (e.target === carritoModal) carritoModal.style.display = "none"; });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && menuMobile) menuMobile.classList.remove("active");
  });
});
