// artists.js (lista de artistas, usado en /artists.html)
document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("contenedor-artistas");
  if (!contenedor) return;

  try {
    const res = await fetch("/api/artists");
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const artistas = await res.json();

    contenedor.innerHTML = artistas.map(artista => `
      <div class="artista">
        <a href="/artists/${artista.slug}">
          <img class="foto-artista" src="${artista.img}" alt="${artista.nombre}">
          <div class="overlay"><h3>${artista.nombre}</h3></div>
        </a>
      </div>
    `).join("");
  } catch (err) {
    console.error("Error al obtener artistas:", err);
    contenedor.innerHTML = "<p>No se pudieron cargar los artistas.</p>";
  }
});
