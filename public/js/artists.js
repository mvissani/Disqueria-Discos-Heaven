// Variables globales
window.discos = window.discos || [];
window.carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

// Fetch de discos
fetch("/cds")
  .then(res => res.json())
  .then(data => {
    window.discos = data.discos || data; 
    mostrarArtistasUnicos();
  })
  .catch(err => console.error("Error al obtener discos:", err));

function mostrarArtistasUnicos() {
  const contenedor = document.getElementById("contenedor-artistas");
  if (!contenedor) return;

  const artistasVistos = new Set();
  const artistas = [];

  window.discos.forEach(disco => {
    if (!artistasVistos.has(disco.artista)) {
      artistasVistos.add(disco.artista);
      artistas.push({
        nombre: disco.artista,
        img: disco.img_artista
      });
    }
  });

  artistas.sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));

  contenedor.innerHTML = artistas.map(artista => `
    <div class="artista" data-artista="${artista.nombre}">
      <img class="foto-artista" src="${artista.img}" alt="${artista.nombre}">
      <div class="overlay"><h3>${artista.nombre}</h3></div>
    </div>
  `).join("");

  // Click en un artista
  document.querySelectorAll(".artista").forEach(div => {
    div.addEventListener("click", () => mostrarDiscosDelArtista(div.dataset.artista));
  });
}

// Mostrar discos de un artista
function mostrarDiscosDelArtista(artista) {
  const seccionArtistas = document.getElementById("contenedor-artistas");
  const seccionDiscos = document.getElementById("discos-del-artista");
  const contenedorDiscos = document.getElementById("contenedor-discos-artista");
  const tituloArtista = document.getElementById("titulo-artista");

  seccionArtistas.style.display = "none";
  seccionDiscos.style.display = "block";
  tituloArtista.textContent = artista;

  // Filtrar y ordenar discos por año descendente
  const discosArtista = window.discos
    .filter(d => d.artista === artista)
    .sort((a, b) => a.año - b.año);

  contenedorDiscos.innerHTML = discosArtista.map(disco => `
    <div class="disco" data-id="${disco.id}">
      <a href="/cd/${disco.slug}"><img class="portada" src="${disco.img}" alt="${disco.titulo}"></a>
      <p class="titulo" style="color:${disco.color}">${disco.titulo}</p>
      <p class="año">Año: ${disco.año}</p>
      <p class="precio">$${Number(disco.precio).toLocaleString("es-AR")}</p>
      <button class="comprar" data-id="${disco.id}">Comprar</button>
    </div>
  `).join("");

  // Inicializar botones comprar
  contenedorDiscos.querySelectorAll(".comprar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const disco = window.discos.find(d => d.id === id);
      if (disco) agregarAlCarrito(disco);
    });
  });

  // Inicializar favoritos
  inicializarFavoritos();

  // Botón volver
  document.getElementById("volver-artistas").onclick = () => {
    seccionDiscos.style.display = "none";
    seccionArtistas.style.display = "grid";
  };
}

// Funciones de carrito
function agregarAlCarrito(disco) {
  const itemExistente = window.carrito.find(i => i.id === disco.id);
  if (itemExistente) itemExistente.cantidad++;
  else window.carrito.push({ ...disco, cantidad: 1 });

  sessionStorage.setItem("carrito", JSON.stringify(window.carrito));
  mostrarMensajeFlotante(`"${disco.titulo}" se agregó correctamente al carrito!`);
}

function mostrarMensajeFlotante(texto) {
  const mensaje = document.getElementById("mensajeFlotante");
  if (!mensaje) return;
  mensaje.textContent = texto;
  mensaje.classList.add("visible");
  setTimeout(() => mensaje.classList.remove("visible"), 2000);
}

