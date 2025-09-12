// Constantes
const pathParts = window.location.pathname.split("/");
const discoSlug = pathParts[pathParts.length - 1];
const contenedor = document.getElementById("discoInd");

// Inicializar carrito global si no existe
window.carrito = JSON.parse(localStorage.getItem("carrito")) || [];

if (!discoSlug) {
  contenedor.innerHTML = "<p>Disco no encontrado.</p>";
} else {
  fetch(`/api/products/${discoSlug}`)
    .then(res => {
      if (!res.ok) throw new Error("Disco no encontrado");
      return res.json();
    })
    .then(disco => {
      console.log(disco);

      // Calcular precio con descuento
      let precioFinal = disco.precio;
      if (disco.descuento_activo && disco.descuento > 0) {
        precioFinal = disco.precio * (1 - disco.descuento / 100);
      }

      contenedor.innerHTML = `
        <div class="disco-individual">
          <div class="disco-left info-container">
            <h1 class="disco-titulo" style="color: ${disco.color}">${disco.titulo}</h1>
            <img src="${disco.img}" alt="${disco.titulo}" class="disco-img"/>
            <p class="disco-artista">${disco.artista}</p>

            <p class="disco-precio">
              ${disco.descuento_activo && disco.descuento > 0 
                ? `<span style="text-decoration: line-through;">$${Number(disco.precio).toLocaleString("es-AR")}</span> 
                  <span style="color: lightgreen;">${disco.descuento}%</span>
                  <p style="font-size: 22px; font-weight: bold;">$${Number(precioFinal).toLocaleString("es-AR")}</p>`
                : `$${Number(disco.precio).toLocaleString("es-AR")}`
              }
            </p>

            <button class="comprar ${disco.stock <= 0 ? "sin-stock" : ""}" 
              data-id="${disco.id}" 
              data-slug="${disco.slug}" 
              ${disco.stock <= 0 ? "disabled" : ""}>
              ${disco.stock > 0 ? "Comprar" : "Sin stock"}
            </button>
          </div>

          <div class="disco-right">
            <!-- Contenedor + Flechas -->
            <div class="img-container">
              <button class="izq"><i class="fa-solid fa-chevron-left"></i></button>
                <img class="img-cd" src="/img/cd4cd.png">
              <button class="der"><i class="fa-solid fa-chevron-right"></i></button>
            </div>

            <div class="info-container">
              <a class="spotify" href="${disco.spotifyUrl}" target="_blank" rel="noopener">
                <i class="fa-brands fa-spotify"></i>
              </a>
              <p class="disco-descripcion">${disco.descripcion_disco || "Sin descripción disponible"}</p>
              <p class="disco-anio">Año de lanzamiento: ${disco.año}</p>
              <p class="disco-canciones">Cantidad de canciones: ${disco.canciones}</p>
              <p class="disco-duracion">Duración total: ${disco.duracion_total} minutos</p>
            </div>

            <div class="lista-canciones-container">
              <h3>Lista de canciones</h3>
              <ul class="lista-canciones"></ul>
            </div>
          </div>
        </div>
      `;

      // Insertar canciones
      const ul = contenedor.querySelector(".lista-canciones");
      if (disco.canciones_detalle && disco.canciones_detalle.length > 0) {
        ul.innerHTML = disco.canciones_detalle.map(c => `<li>${c.titulo}</li>`).join("");
      } else {
        ul.innerHTML = "<li>No hay canciones disponibles</li>";
      }

      // Botón Comprar
      const btnComprar = contenedor.querySelector(".comprar");
      btnComprar.addEventListener("click", () => {
        const itemExistente = window.carrito.find(i => i.id === disco.id);
        const cantidadEnCarrito = itemExistente ? itemExistente.cantidad : 0;

        if (cantidadEnCarrito >= disco.stock) {
          const mensaje = document.getElementById("mensajeFlotante");
          if (mensaje) {
            mensaje.textContent = `No podés agregar más de "${disco.titulo}"`;
            mensaje.classList.add("visible");
            setTimeout(() => mensaje.classList.remove("visible"), 2000);
          }
          return;
        }

        let precioFinal = disco.precio;
        if (disco.descuento_activo && disco.descuento > 0) {
          precioFinal = disco.precio * (1 - disco.descuento / 100);
        }

        if (itemExistente) itemExistente.cantidad++;
        else window.carrito.push({
          id: disco.id,
          titulo: disco.titulo,
          artista: disco.artista,
          precio: precioFinal,
          img: disco.img,
          slug: disco.slug,
          cantidad: 1
        });

        const stockRestante = disco.stock - (itemExistente ? itemExistente.cantidad : 1);
        if (stockRestante <= 0 && btnComprar) {
          btnComprar.disabled = true;
          btnComprar.textContent = "Sin stock";
          btnComprar.classList.add("sin-stock");
        }

        localStorage.setItem("carrito", JSON.stringify(window.carrito));

        const mensaje = document.getElementById("mensajeFlotante");
        if (mensaje) {
          mensaje.textContent = `"${disco.titulo}" se agregó al carrito!`;
          mensaje.classList.add("visible");
          setTimeout(() => mensaje.classList.remove("visible"), 2000);
        }
      });

      // Alternancia info/canciones con flechas
      const infoContainer = contenedor.querySelector(".disco-right .info-container");
      const cancionesContainer = contenedor.querySelector(".lista-canciones-container");
      const leftArrow = contenedor.querySelector(".izq");
      const rightArrow = contenedor.querySelector(".der");

      let mostrandoInfo = true;
      infoContainer.style.display = "block";
      cancionesContainer.style.display = "none";

      const toggleContent = () => {
        mostrandoInfo = !mostrandoInfo;
        infoContainer.style.display = mostrandoInfo ? "block" : "none";
        cancionesContainer.style.display = mostrandoInfo ? "none" : "block";
      };

      leftArrow.addEventListener("click", toggleContent);
      rightArrow.addEventListener("click", toggleContent);
    })
    .catch(err => {
      contenedor.innerHTML = `<p>Error al cargar el disco: ${err.message}</p>`;
      console.error(err);
    });
}
