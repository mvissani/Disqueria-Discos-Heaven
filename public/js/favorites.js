(() => {
  // Variables y contenedor
  const contenedorFavoritos = document.getElementById("contenedor-favoritos");
  let favoritos = [];

  // Función para mostrar mensaje flotante
  function mostrarMensajeFlotante(texto) {
    const mensaje = document.getElementById("mensajeFlotante");
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.classList.add("visible");
    setTimeout(() => mensaje.classList.remove("visible"), 2000);
  }

  // Cargar favoritos desde backend
  async function cargarFavoritos() {
    if (!contenedorFavoritos) return;

    const token = sessionStorage.getItem("token");
    if (!token) {
      contenedorFavoritos.innerHTML = "<p>Debes iniciar sesión para ver tus favoritos.</p>";
      return;
    }

    try {
      const res = await fetch("/api/favorites/me", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("No autorizado");

      favoritos = await res.json();

      contenedorFavoritos.innerHTML = "";

      if (!Array.isArray(favoritos) || favoritos.length === 0) {
        contenedorFavoritos.innerHTML = "<p>No tienes discos favoritos aún.</p>";
        return;
      }

      favoritos.forEach(disco => {
        const card = document.createElement("div");
        card.className = "card favorito-item";
        card.dataset.id = disco.id; // siempre poner id incluso si es 0
        card.innerHTML = `
          <div class="disco">
            <a href="/product/${disco.slug}">
              <img class="portada" src="${disco.img}" alt="${disco.titulo}">
            </a>
            <button class="toggle-fav" data-id="${disco.id}">
              <i class="fa-solid fa-star"></i>
            </button>
            <div class="titulo">${disco.titulo}</div>
            <div class="artista">${disco.artista}</div>
          </div>
        `;
        contenedorFavoritos.appendChild(card);
      });

    } catch (err) {
      console.error("Error al cargar favoritos:", err);
      contenedorFavoritos.innerHTML = "<p>Error al cargar favoritos.</p>";
    }
  }

  // Delegación de eventos para toggle de favoritos
  if (contenedorFavoritos) {
    contenedorFavoritos.addEventListener("click", async (e) => {
      const btn = e.target.closest(".toggle-fav");
      if (!btn) return;

      const discoId = Number(btn.dataset.id); // asegurar tipo number
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
          body: JSON.stringify({ disco_id: discoId })
        });

        if (!res.ok) throw new Error("Error al actualizar favorito");

        const data = await res.json();
        const nombre = btn.closest(".favorito-item").querySelector(".titulo")?.textContent || "";

        if (!data.favorito) {
          // eliminar correctamente incluso si id = 0
          const item = btn.closest(".favorito-item");
          if (item) item.remove();
          mostrarMensajeFlotante(`"${nombre}" fue eliminado de favoritos.`);
        } else {
          mostrarMensajeFlotante(`"${nombre}" fue agregado a favoritos.`);
        }

        // Mostrar mensaje si no quedan favoritos
        if (contenedorFavoritos.children.length === 0) {
          contenedorFavoritos.innerHTML = "<p>No tienes discos favoritos aún.</p>";
        }

      } catch (err) {
        console.error(err);
        alert("Error al actualizar favoritos");
      }
    });
  }

  // Inicializar al cargar la página
  document.addEventListener("DOMContentLoaded", cargarFavoritos);
})();
