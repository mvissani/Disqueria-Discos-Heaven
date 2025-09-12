async function cargarOfertas() {
  try {
    const res = await fetch("/api/products/offers");
    const discos = await res.json();

    const contenedor = document.getElementById("lista-ofertas");

    if (discos.length === 0) {
      contenedor.innerHTML = "<p>No hay ofertas activas en este momento.</p>";
      return;
    }

    contenedor.innerHTML = discos.map(disco => `
      <div class="card-oferta">
        <a href="/product/${disco.slug}"><img src="${disco.img}" alt="${disco.titulo}"></a>
        <h2 style="color:${disco.color}">${disco.titulo}</h2>
        <p>${disco.artista}</p>
        <p>${disco.canciones} canciones</p>
        <p>${disco.año}</p>
        <p>Precio Original: <s>$${disco.precio}</s></p>
        <p style="color: lightgreen;">Descuento: <strong>${disco.descuento}% OFF</strong></p>
        <p>Precio Nuevo: <strong>$${(disco.precio * (1 - disco.descuento / 100)).toLocaleString("es-AR")}</strong></p>
        <button class="comprar "data-id="${disco.id}">Comprar</button>
      </div>
    `).join("");
  } catch (error) {
    console.error("Error al cargar ofertas:", error);
    document.getElementById("lista-ofertas").innerHTML = "<p>Error al cargar las ofertas.</p>";
  }
}

// Cargar las ofertas al cargar la página
cargarOfertas();

