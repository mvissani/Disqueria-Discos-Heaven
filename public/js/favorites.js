// Variables y contenedor
const contenedorFavoritos = document.getElementById("contenedor-favoritos");
let favoritos = [];

// Función para cargar favoritos desde la API
async function cargarFavoritos() {
  if (!contenedorFavoritos) {
    console.warn("No se encontró el contenedor de favoritos.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    contenedorFavoritos.innerHTML = "<p>Debes iniciar sesión para ver tus favoritos.</p>";
    return;
  }

  try {
    const res = await fetch("/api/favorites/me", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("No se pudieron obtener los favoritos.");
    favoritos = await res.json();

    contenedorFavoritos.innerHTML = "";
    if (favoritos.length === 0) {
      contenedorFavoritos.innerHTML = "<p>No tienes discos favoritos aún.</p>";
      return;
    }

    favoritos.forEach(disco => {
      const card = document.createElement("div");
      card.className = "card favorito-item";
      card.innerHTML = `
      <div class="disco">
        <a href="/cd/${disco.slug}"><img class="portada" src="${disco.img}" alt="${disco.titulo}"></a>
        <div class="titulo">${disco.titulo}</div>
        <div class="artista">${disco.artista}</div>
        <button class="toggle-fav" data-id="${disco.id}"><i class="fa-solid fa-star"></i></button>
      </div>
      `;
      contenedorFavoritos.appendChild(card);
    });

    inicializarBotonesFav();
  } catch (err) {
    console.error("Error al cargar favoritos:", err);
    contenedorFavoritos.innerHTML = `<p>Error al cargar favoritos.</p>`;
  }
}

// Función para inicializar botones
function inicializarBotonesFav() {
  const botones = document.querySelectorAll(".toggle-fav");
  botones.forEach(btn => {
    btn.addEventListener("click", async () => {
      const discoId = btn.dataset.id;
      const token = localStorage.getItem("token");

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
          body: JSON.stringify({ disco_id: discoId })
        });

        if (!res.ok) throw new Error("No se pudieron actualizar los favoritos.");
        const data = await res.json();

        // Si ya no es favorito, elimina el disco del DOM
        if (!data.favorito) {
          // Obtén el nombre antes de eliminar el disco
          const nombre = btn.closest(".favorito-item").querySelector(".titulo").textContent;
          mostrarMensajeFlotante(`"${nombre}" fue eliminado correctamente de favoritos.`);
          btn.closest(".favorito-item").remove();

          if (contenedorFavoritos.children.length === 0) {
            contenedorFavoritos.innerHTML = "<p>No tenes discos favoritos aún.</p>";
          }
        } else {
          // Cambia a estrella llena (ya está en favoritos)
          const icono = btn.querySelector("i");
          if (icono) {
            icono.classList.remove("fa-regular");
            icono.classList.add("fa-solid");
          }
          // Obtén el nombre del disco
          const nombre = btn.closest(".favorito-item").querySelector(".titulo").textContent;
          mostrarMensajeFlotante(`"${nombre}" fue agregado a favoritos exitosamente.`);
        }
      } catch (err) {
        console.error(err);
        alert("Error al actualizar favoritos.");
      }
    });
  });
}

// Función para mostrar mensaje flotante
function mostrarMensajeFlotante(texto) {
  const mensaje = document.getElementById("mensajeFlotante");
  if (mensaje) {
    mensaje.textContent = texto;
    mensaje.classList.add("visible");
    setTimeout(() => mensaje.classList.remove("visible"), 2000);
  }
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarFavoritos();
});
