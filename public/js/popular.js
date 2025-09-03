async function cargarPopulares() {
  try {
    const res = await fetch("/cds/popular");
    const discos = await res.json();

    const contenedor = document.getElementById("lista-populares");

    if (discos.length === 0) {
      contenedor.innerHTML = "<p>No hay discos populares en este momento.</p>";
      return;
    }

    contenedor.innerHTML = discos.map(disco => `
      <div class="card-popular">
        <a href="/cd/${disco.slug}"><img src="${disco.img}" alt="${disco.titulo}"></a>
        <h2 style="color:${disco.color}">${disco.titulo}</h2>
        <p>${disco.artista}</p>
        <p>Precio: $${Number(disco.precio).toLocaleString("es-AR")}</p>
        <button class="comprar "data-id="${disco.id}">Comprar</button>
      </div>
    `).join("");
  } catch (error) {
    console.error("Error al cargar los discos populares:", error);
    document.getElementById("lista-populares").innerHTML = "<p>Error al cargar los discos populares.</p>";
  }
}

// Cargar los discos populares al cargar la página
cargarPopulares();







