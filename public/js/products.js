// Variables globales
window.discos = window.discos || [];
window.carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let currentPage = 1;
const limit = 8; // discos por página

// Funciones de carrito
function agregarAlCarrito(disco) {
  const itemExistente = window.carrito.find(i => i.id === disco.id);
  if (itemExistente) itemExistente.cantidad++;
  else window.carrito.push({ ...disco, cantidad: 1 });

  localStorage.setItem("carrito", JSON.stringify(window.carrito));
  mostrarMensajeFlotante(`"${disco.titulo}" se agregó correctamente al carrito!`);
}

function mostrarMensajeFlotante(texto) {
  const mensaje = document.getElementById("mensajeFlotante");
  if (!mensaje) return;
  mensaje.textContent = texto;
  mensaje.classList.add("visible");
  setTimeout(() => mensaje.classList.remove("visible"), 2000);
}

// Mostrar discos con paginación
function mostrarDiscos(listaDiscos) {
  const contenedor = document.getElementById("contenedor-discos");
  if (!contenedor) return;

  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const discosPagina = listaDiscos.slice(start, end);

  contenedor.innerHTML = discosPagina.map(disco => `
    <div class="disco" data-id="${disco.id}">
      <img class="portada" src="${disco.img}" alt="${disco.titulo}">
      <p class="titulo" style="color:${disco.color}">
        <a href="/cd/${disco.slug}" style="color:${disco.color}; text-decoration: none">${disco.titulo}</a>
      </p>
      <p class="artista">${disco.artista}</p>
      <span class="detalles" style="display:none;">
        <a class="spotify" href="${disco.spotifyUrl}" target="_blank">
          <i class="fa-brands fa-spotify"></i>
        </a>
        <p class="precio">$${Number(disco.precio).toLocaleString("es-AR")}</p>
        <p class="totalcanciones">Cantidad de Canciones: ${disco.canciones}</p>
        <p class="año">Año de Lanzamiento: ${disco.año}</p>
        <button class="comprar" data-id="${disco.id}">Comprar</button>
        <button class="favorito" data-id="${disco.id}">
          <i class="fa-regular fa-star"></i>
        </button>
      </span>
    </div>
  `).join("");

  // Inicializar hover y favoritos
  document.querySelectorAll(".disco").forEach(d => {
    const detalles = d.querySelector(".detalles");
    d.addEventListener("mouseenter", () => { if (detalles) detalles.style.display = "block"; });
    d.addEventListener("mouseleave", () => { if (detalles) detalles.style.display = "none"; });
  });
  inicializarFavoritos();

  renderPagination(listaDiscos.length);
}

// Renderizar botones de paginación
function renderPagination(totalDiscos) {
  let paginationDiv = document.getElementById("pagination");
  if (!paginationDiv) {
    paginationDiv = document.createElement("div");
    paginationDiv.id = "pagination";
    document.querySelector("main").appendChild(paginationDiv);
  }

  const totalPages = Math.ceil(totalDiscos / limit);
  paginationDiv.innerHTML = "";

  if (currentPage > 1) {
    const prev = document.createElement("button");
    prev.textContent = "Anterior";
    prev.addEventListener("click", () => { currentPage--; mostrarDiscos(filteredDiscos()); });
    paginationDiv.appendChild(prev);
  }

  // Botones numéricos
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = (i === currentPage);
    btn.addEventListener("click", () => { currentPage = i; mostrarDiscos(filteredDiscos()); });
    paginationDiv.appendChild(btn);
  }

  if (currentPage < totalPages) {
    const next = document.createElement("button");
    next.textContent = "Siguiente";
    next.addEventListener("click", () => { currentPage++; mostrarDiscos(filteredDiscos()); });
    paginationDiv.appendChild(next);
  }
}

// Función para filtrar discos según búsqueda
function filteredDiscos() {
  const termino = document.getElementById("busqueda")?.value.toLowerCase() || "";
  return window.discos.filter(d =>
    d.titulo.toLowerCase().includes(termino) ||
    d.artista.toLowerCase().includes(termino)
  );
}

// Inicializar productos
function inicializarProductos() {
  const contenedor = document.getElementById("contenedor-discos");
  if (!contenedor) return;

  document.getElementById("busqueda")?.addEventListener("input", () => {
    currentPage = 1;
    mostrarDiscos(filteredDiscos());
  });

  contenedor.addEventListener("click", e => {
    if (e.target.classList.contains("comprar")) {
      const id = Number(e.target.dataset.id);
      const disco = window.discos.find(d => d.id === id);
      if (!disco) return;
      agregarAlCarrito(disco);
    }
  });

  mostrarDiscos(filteredDiscos());
}

// Inicializar favoritos
function inicializarFavoritos() {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch(`/api/favorites/me`, { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => res.json())
    .then(favoritos => {
      document.querySelectorAll(".favorito").forEach(btn => {
        const discoId = Number(btn.dataset.id);
        const icono = btn.querySelector("i");
        if (favoritos.some(f => f.id === discoId)) {
          icono.classList.replace("fa-regular", "fa-solid");
        } else {
          icono.classList.replace("fa-solid", "fa-regular");
        }

        btn.addEventListener("click", async () => {
          try {
            const res = await fetch("/api/favorites", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
              body: JSON.stringify({ disco_id: discoId })
            });
            const data = await res.json();
            const disco = window.discos.find(d => d.id === discoId);
            const nombre = disco?.titulo || "Disco";

            if (data.favorito) {
              icono.classList.replace("fa-regular", "fa-solid");
              mostrarMensajeFlotante(`"${nombre}" agregado a favoritos!`);
            } else {
              icono.classList.replace("fa-solid", "fa-regular");
              mostrarMensajeFlotante(`"${nombre}" eliminado de favoritos!`);
            }
          } catch { alert("No se pudo actualizar el favorito."); }
        });
      });
    });
}

// Inicializo DOM
document.addEventListener("DOMContentLoaded", inicializarProductos);
