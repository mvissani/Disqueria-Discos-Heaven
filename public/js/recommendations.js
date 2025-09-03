async function cargarRecomendaciones() {
  try {
    const res = await fetch("/cds/recommendations");
    const discos = await res.json();

    const contenedor = document.getElementById("lista-recomendaciones");

    if (discos.length === 0) {
      contenedor.innerHTML = "<p>No hay recomendaciones en este momento.</p>";
      return;
    }

    contenedor.innerHTML = discos.map(disco => `
      <div class="card-recomendacion">
        <a href="/cd/${disco.slug}"><img src="${disco.img}" alt="${disco.titulo}"></a>
        <h2 style="color:${disco.color}">${disco.titulo}</h2>
        <p>${disco.artista}</p>
        <p>Precio: $${Number(disco.precio).toLocaleString("es-AR")}</p>
        <button class="comprar "data-id="${disco.id}">Comprar</button>
      </div>
    `).join("");
  } catch (error) {
    console.error("Error al cargar recomendaciones:", error);
    document.getElementById("lista-recomendaciones").innerHTML = "<p>Error al cargar las recomendaciones.</p>";
  }
}

// Cargar las recomendaciones al cargar la página
cargarRecomendaciones();







