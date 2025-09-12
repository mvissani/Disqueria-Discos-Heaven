// Variables globales
window.discos = [];
window.carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let favoritos = [];
let currentPage = 1;
// Discos por página
const limit = 8; 

// Fetch de discos
fetch("/api/products")
  .then(res => res.json())
  .then(data => {
    window.discos = data.discos || data;
    const event = new CustomEvent("discosListos", { detail: window.discos });
    window.dispatchEvent(event);
  })
  .catch(err => console.error("Error al obtener discos:", err));


// Mostrar discos con paginación
function mostrarDiscos(listaDiscos) {
  const contenedor = document.getElementById("contenedor-discos");
  if (!contenedor) return;

  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const discosPagina = listaDiscos.slice(start, end);

  contenedor.innerHTML = discosPagina.map(disco => {
    const isFavorito = favoritos.some(f => Number(f.id) === Number(disco.id));
    return `
      <div class="disco" data-id="${disco.id}">
        <img class="portada" src="${disco.img}" alt="${disco.titulo}">
        <p class="titulo" style="color:${disco.color}">
          <a href="/products/${disco.slug}" style="color:${disco.color}; text-decoration:none">${disco.titulo}</a>
        </p>
        <p class="artista">${disco.artista}</p>
        <span class="detalles" style="display:none;">
          <button class="favorito" data-id="${disco.id}">
            <i class="${isFavorito ? 'fa-solid' : 'fa-regular'} fa-star"></i>
          </button>
          <p class="precio">$${Number(disco.precio).toLocaleString("es-AR")}</p>
          <p class="totalcanciones">Cantidad de Canciones: ${disco.canciones}</p>
          <p class="año">Año de Lanzamiento: ${disco.año}</p>
          <button class="comprar" data-id="${disco.id}">Comprar</button>
        </span>
      </div>
    `;
  }).join("");

  // Hover detalles
  document.querySelectorAll(".disco").forEach(d => {
    const detalles = d.querySelector(".detalles");
    d.addEventListener("mouseenter", () => { if (detalles) detalles.style.display = "block"; });
    d.addEventListener("mouseleave", () => { if (detalles) detalles.style.display = "none"; });
  });

  inicializarEventosDisco();
  renderPagination(listaDiscos.length);
}

// Paginación
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

// Filtrado por búsqueda
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
    const idRaw = e.target.dataset.id;
    // El id = 0 es valido
    if (idRaw === undefined) return; 
    const id = Number(idRaw);

    if (e.target.classList.contains("comprar")) {
      const disco = window.discos.find(d => Number(d.id) === id);
      if (!disco) return;
      agregarAlCarrito(disco);
    }

    if (e.target.classList.contains("favorito")) {
      toggleFavorito(id, e.target);
    }
  });

  mostrarDiscos(filteredDiscos());
}


// Inicializar favoritos
async function inicializarFavoritos() {
  const token = sessionStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("/api/favorites/me", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("No autorizado");
    const data = await res.json();
    favoritos = Array.isArray(data) ? data : [];

    document.querySelectorAll(".disco").forEach(discoEl => {
      const idRaw = discoEl.dataset.id;
      // El id = 0 es valido
      if (idRaw === undefined) return;
      const id = Number(idRaw);

      const btn = discoEl.querySelector(".favorito i");
      if (btn) {
        btn.classList.toggle("fa-solid", favoritos.some(f => Number(f.id) === id));
        btn.classList.toggle("fa-regular", !favoritos.some(f => Number(f.id) === id));
      }
    });
  } catch (err) {
    console.error("Error al obtener favoritos:", err);
    favoritos = [];
  }
}

// Delegación de eventos para favoritos
document.body.addEventListener("click", async (e) => {
  const btn = e.target.closest(".favorito");
  if (!btn) return;

  const idRaw = btn.dataset.id;
  // El id = 0 es valido
  if (idRaw === undefined) return; 
  const discoId = Number(idRaw);

  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión para agregar favoritos.");
    return;
  }

  try {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ disco_id: Number(discoId) })
    });

    if (!res.ok) throw new Error("No se pudieron actualizar los favoritos.");
    const data = await res.json();

    if (data.favorito) {
      if (!favoritos.some(f => Number(f.id) === discoId)) favoritos.push({ id: discoId });
    } else {
      favoritos = favoritos.filter(f => Number(f.id) !== discoId);
    }

    const icon = btn.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-solid", data.favorito);
      icon.classList.toggle("fa-regular", !data.favorito);
    }

    const mensaje = document.getElementById("mensajeFlotante");
    if (mensaje) {
      const nombreDisco = btn.closest(".disco").querySelector(".titulo")?.textContent || "";
      mensaje.textContent = data.favorito
        ? `${nombreDisco} agregado a favoritos!`
        : `${nombreDisco} eliminado de favoritos.`;
      mensaje.classList.add("visible");
      setTimeout(() => mensaje.classList.remove("visible"), 2000);
    }
  } catch (err) {
    console.error(err);
    alert("Error al actualizar favoritos.");
  }
});

// Inicializar eventos discos
function inicializarEventosDisco() {
  
}

// Escuchar evento discosListos
window.addEventListener("discosListos", async () => {
  await inicializarFavoritos(); 
  inicializarProductos();
});
