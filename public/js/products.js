// Variables globales
window.discos = window.discos || [];
window.carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Funciones de carrito
function agregarAlCarrito(disco) {
  const itemExistente = window.carrito.find(i => i.id === disco.id);
  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    window.carrito.push({ ...disco, cantidad: 1 });
  }
  localStorage.setItem("carrito", JSON.stringify(window.carrito));

  const mensaje = document.getElementById("mensajeFlotante");
  if (mensaje) {
    mensaje.textContent = `"${disco.titulo}" se agregó correctamente al carrito!`;
    mensaje.classList.add("visible");
    setTimeout(() => mensaje.classList.remove("visible"), 2000);
  }
}

function mostrarMensajeFlotante(texto) {
  const mensaje = document.getElementById("mensajeFlotante");
  if (mensaje) {
    mensaje.textContent = texto;
    mensaje.classList.add("visible");
    setTimeout(() => mensaje.classList.remove("visible"), 2000);
  }
}

// Inicializar productos
function inicializarProductos() {
  const contenedor = document.getElementById("contenedor-discos");
  const inputBusqueda = document.getElementById("busqueda");

  if (!contenedor) return;

  function mostrarDiscos(listaDiscos) {
    contenedor.innerHTML = listaDiscos.map(disco => `
      <div class="disco" data-id="${disco.id}">
        <img class="portada" src="${disco.img}" alt="${disco.titulo}">
        <p class="titulo" style="color:${disco.color}">
          <a href="/cd/${disco.slug}" style="color:${disco.color}; text-decoration: none">${disco.titulo}</a>
        </p>
        <p class="artista">${disco.artista}</p>
        <span class="detalles" style="display:none;">
          <a class="spotify" href="${disco.spotifyUrl}" target="_blank" rel="noopener">
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

    document.querySelectorAll(".disco").forEach(d => {
      const detalles = d.querySelector(".detalles");
      d.addEventListener("mouseenter", () => { if (detalles) detalles.style.display = "block"; });
      d.addEventListener("mouseleave", () => { if (detalles) detalles.style.display = "none"; });
    });

    inicializarFavoritos();
  }

  contenedor.addEventListener("click", e => {
    if (e.target.classList.contains("comprar")) {
      const id = Number(e.target.dataset.id);
      const disco = window.discos.find(d => d.id === id);
      if (!disco) return;
      agregarAlCarrito(disco);
    }
  });

  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", () => {
      const termino = inputBusqueda.value.toLowerCase();
      const filtrados = window.discos.filter(d =>
        d.titulo.toLowerCase().includes(termino) ||
        d.artista.toLowerCase().includes(termino)
      );
      mostrarDiscos(filtrados);
    });
  }

  if (window.discos.length) mostrarDiscos(window.discos);
}

// Inicializar favoritos
function inicializarFavoritos() {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch(`/api/favorites/me`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudieron obtener los favoritos.");
      return res.json();
    })
    .then(favoritos => {
      document.querySelectorAll(".favorito").forEach(btn => {
        const discoId = Number(btn.dataset.id);
        const icono = btn.querySelector("i");

        if (favoritos.some(f => f.id === discoId)) {
          icono.classList.remove("fa-regular");
          icono.classList.add("fa-solid");
        } else {
          icono.classList.remove("fa-solid");
          icono.classList.add("fa-regular");
        }

        btn.addEventListener("click", async () => {
          try {
            const res = await fetch("/api/favorites", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({ disco_id: discoId }) 
            });
            if (!res.ok) throw new Error("Error al actualizar los favoritos.");
            const data = await res.json();

            // Busca el disco por id en window.discos
            const disco = window.discos.find(d => d.id === discoId);
            const nombre = disco ? disco.titulo : "Disco";

            if (data.favorito) {
              icono.classList.remove("fa-regular");
              icono.classList.add("fa-solid");
              mostrarMensajeFlotante(`"${nombre}" fue agregado a favoritos con éxito!`);
            } else {
              icono.classList.remove("fa-solid");
              icono.classList.add("fa-regular");
              mostrarMensajeFlotante(`"${nombre}" fue eliminado de favoritos con éxito!`);
            }
          } catch (err) {
            console.error(err);
            alert("No se pudo actualizar el favorito. Intente nuevamente.");
          }
        });
      });
    })
    .catch(err => console.error(err));
}

// Inicializo DOM
document.addEventListener("DOMContentLoaded", () => {
  inicializarProductos();
});
