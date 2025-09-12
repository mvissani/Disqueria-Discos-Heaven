document.addEventListener("DOMContentLoaded", async () => {
  const titulo = document.querySelector(".nombre-artista");
  const contenedor = document.getElementById("artistaInd");

  // Obtener slug del artista desde la URL
  const path = window.location.pathname; 
  const slug = path.split("/").pop();

  try {
    const res = await fetch(`/api/artists/${slug}`);
    if (!res.ok) throw new Error(`Error al obtener artista: ${res.statusText}`);

    const data = await res.json();

    // Poner nombre en el <h2> ya existente
    titulo.textContent = data.artista;

    // Limpio discos
    contenedor.innerHTML = "";

    // Renderizar discos
    data.discos.forEach(disco => {
      const discoHTML = document.createElement("div");
      discoHTML.classList.add("disco-individual");

      discoHTML.innerHTML = `
        <a href="/products/${disco.slug}">
          <img src="${disco.img}" alt="${disco.titulo}" class="portada">
        </a>
        <h3>${disco.titulo}</h3>
        <p>Año: ${disco.año}</p>
        <p>Precio: $${Number(disco.precio).toLocaleString("es-AR")}</p>
        <button class="comprar" data-id="${disco.id}">Comprar</button>
      `;

      contenedor.appendChild(discoHTML);
    });

  } catch (err) {
    console.error(err);
    titulo.textContent = "Error";
    contenedor.innerHTML = `<p>No se pudo cargar la información del artista.</p>`;
  }
});
