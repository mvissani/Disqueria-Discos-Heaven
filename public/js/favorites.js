// =============================
// favorites.js
// =============================

document.addEventListener("DOMContentLoaded", () => {
  const contenedorFavoritos = document.getElementById("contenedor-favoritos");
  const token = localStorage.getItem("token");

  if (!contenedorFavoritos) return;

  // Función para mostrar mensaje flotante
  function mostrarMensajeFlotante(texto) {
    const mensaje = document.getElementById("mensajeFlotante");
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.classList.add("visible");
    setTimeout(() => mensaje.classList.remove("visible"), 2000);
  }

  // Función para cargar favoritos desde la API
  // Cargar favoritos del usuario
async function cargarFavoritos(usuario_id) {
  if (!usuario_id) return [];

  try {
    const res = await fetch("/api/favorites/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id })
    });

    if (!res.ok) throw new Error("No se pudieron obtener los favoritos.");

    const favoritos = await res.json();
    return Array.isArray(favoritos) ? favoritos : [];
  } catch (err) {
    console.error("Error al cargar favoritos:", err);
    return [];
  }
}

// Inicializar botones de favoritos
async function inicializarFavoritos(usuario_id) {
  const favoritos = await cargarFavoritos(usuario_id);

  document.querySelectorAll(".favorito").forEach(btn => {
    const discoId = Number(btn.dataset.id);
    const icono = btn.querySelector("i");

    // Marcar favorito si corresponde
    if (favoritos.some(f => f.id === discoId)) {
      icono.classList.remove("fa-regular");
      icono.classList.add("fa-solid");
    } else {
      icono.classList.remove("fa-solid");
      icono.classList.add("fa-regular");
    }

    // Click para toggle
    btn.addEventListener("click", async () => {
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario_id, disco_id: discoId })
        });

        if (!res.ok) throw new Error("Error al actualizar los favoritos.");

        const data = await res.json();
        if (data.favorito) {
          icono.classList.remove("fa-regular");
          icono.classList.add("fa-solid");
        } else {
          icono.classList.remove("fa-solid");
          icono.classList.add("fa-regular");
        }
      } catch (err) {
        console.error(err);
        alert("No se pudo actualizar el favorito. Intente nuevamente.");
      }
    });
  });
}

  // Inicializar
  cargarFavoritos();
});
