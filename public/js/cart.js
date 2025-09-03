document.addEventListener("DOMContentLoaded", () => {
  // --- Carrito escritorio ---
  const carritoBtn = document.getElementById("carritoBtn");
  const carrito = document.getElementById("carrito");
  const carritoItems = document.getElementById("carritoItems");
  const cerrarCarrito = document.getElementById("cerrarCarrito");
  const subtotalCarrito = document.getElementById("subtotalCarrito");
  const contador = document.getElementById("carritoContador");

  // --- Carrito móvil ---
  const carritoBtnMobile = document.getElementById("carritoBtnMobile");
  const carritoMobile = document.getElementById("carritoMobile");
  const carritoItemsMobile = document.getElementById("carritoItemsMobile");
  const cerrarCarritoMobile = document.getElementById("cerrarCarritoMobile");
  const subtotalCarritoMobile = document.getElementById("subtotalCarritoMobile");
  const contadorMobile = document.getElementById("carritoContadorMobile");

  // Carrito desde localStorage
  let carritoData = Array.isArray(JSON.parse(localStorage.getItem("carrito"))) 
                     ? JSON.parse(localStorage.getItem("carrito")) 
                     : [];

  // Guardar carrito
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carritoData));
  }

  // Actualizar contadores
  function actualizarContadores() {
    const total = carritoData.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    [contador, contadorMobile].forEach(c => {
      if (!c) return;
      c.style.display = total > 0 ? "inline-block" : "none";
      c.textContent = total;
    });
  }

  // Actualizar subtotal
  function actualizarSubtotal() {
    const subtotal = carritoData.reduce((acc, item) => acc + ((item.precio || 0) * (item.cantidad || 0)), 0);
    const cantidadTotal = carritoData.reduce((acc, item) => acc + (item.cantidad || 0), 0);

    if (subtotalCarrito) subtotalCarrito.innerHTML = `
      <p>CANTIDAD DE ARTÍCULOS: ${cantidadTotal}</p>
      <p>SUBTOTAL: $${subtotal.toLocaleString("es-AR")}</p>`;
    if (subtotalCarritoMobile) subtotalCarritoMobile.innerHTML = `
      <p>CANTIDAD DE ARTÍCULOS: ${cantidadTotal}</p>
      <p>SUBTOTAL: $${subtotal.toLocaleString("es-AR")}</p>`;
  }

  // Crear item del carrito
  function crearItemCarrito(item) {
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.dataset.id = item.id;

    const titulo = item.titulo || "Sin título";
    const artista = item.artista || "Sin artista";
    const precioFinal = Number(item.precio) || 0;
    const precioOriginal = Number(item.precioOriginal) || precioFinal;
    const descuento = Number(item.descuento) || 0;

    div.innerHTML = `
      <div class="item-izquierda">
        <div class="item-img-container">
          <a href="/cd/${item.slug}"><img src="${item.img}" alt="${titulo}"></a>
        </div>
        <div class="cantidad-container">
          <button class="menos" data-id="${item.id}">-</button>
          <span class="cantidad-texto" data-id="${item.id}">${item.cantidad || 0}</span>
          <button class="mas" data-id="${item.id}">+</button>
        </div>
        <button class="eliminarBtn" data-id="${item.id}">Eliminar</button>
      </div>
      <div class="item-derecha">
        <p>Título: ${titulo}</p>
        <p>Artista: ${artista}</p>
        ${item.descuento_activo
          ? `<p>Antes: <s>$${precioOriginal.toLocaleString("es-AR")}</s> (${descuento}%)</p>
             <p>Ahora: $${precioFinal.toLocaleString("es-AR")}</p>`
          : `<p>Precio: $${precioFinal.toLocaleString("es-AR")}</p>`}
      </div>
    `;
    return div;
  }

  // Mostrar carrito
  function mostrarCarrito(esMovil = false) {
    const contenedor = esMovil ? carritoItemsMobile : carritoItems;
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (!Array.isArray(carritoData) || carritoData.length === 0) {
      contenedor.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
      carritoData.forEach(item => contenedor.appendChild(crearItemCarrito(item)));

      // Botón "Proceder al Pago"
      const botonPagar = document.createElement("button");
      botonPagar.textContent = "Proceder al Pago";
      botonPagar.id = "btnFinalizarCompra";
      botonPagar.style.marginTop = "10px";
      contenedor.appendChild(botonPagar);

      // Evento click para finalizar compra
      botonPagar.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Debes iniciar sesión para comprar.");
          return;
        }

        const orden = {
          items: carritoData.map(item => ({
            id: item.id,
            cantidad: item.cantidad,
            precio: item.precio
          }))
        };

        try {
          const res = await fetch("/api/myorders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(orden)
          });

          if (res.ok) {
            carritoData = [];
            guardarCarrito();
            actualizarContadores();
            actualizarSubtotal();
            mostrarCarrito(true);
            mostrarCarrito(false);
            alert("¡Orden realizada con éxito!");
          } else {
            const error = await res.json();
            alert("Error al procesar la orden: " + error.error);
          }
        } catch (err) {
          console.error(err);
          alert("Error al procesar la orden.");
        }
      });
    }

    actualizarSubtotal();
    if (esMovil) carritoMobile.classList.add("carrito-mobile-activo");
    else carrito.style.display = "flex";
  }

  // Cerrar carrito
  function cerrarCarritoFunc(esMovil = false) {
    if (esMovil) carritoMobile.classList.remove("carrito-mobile-activo");
    else carrito.style.display = "none";
  }

  // Cambiar cantidad respetando stock
  function cambiarCantidad(id, nuevaCantidad) {
    const item = carritoData.find(i => i.id == id);
    if (!item) return;

    const disco = window.discos?.find(d => d.id == id) || { stock: Infinity };
    const cantidadFinal = Math.min(Math.max(nuevaCantidad, 1), disco.stock || Infinity);

    item.cantidad = cantidadFinal;
    guardarCarrito();
    actualizarContadores();
    actualizarSubtotal();

    document.querySelectorAll(`[data-id="${id}"].cantidad-texto`).forEach(span => span.textContent = item.cantidad);
  }

  // Eliminar item
  function eliminarDelCarrito(id) {
    carritoData = carritoData.filter(item => item.id != id);
    guardarCarrito();
    actualizarContadores();
    mostrarCarrito(true);
    mostrarCarrito(false);
  }

  // Eventos delegados botones (+, -, eliminar)
  [carritoItems, carritoItemsMobile].forEach(contenedor => {
    if (!contenedor) return;
    contenedor.addEventListener("click", e => {
      const id = e.target.dataset.id;
      if (!id) return;

      if (e.target.classList.contains("mas")) cambiarCantidad(id, (carritoData.find(i => i.id == id)?.cantidad || 0) + 1);
      if (e.target.classList.contains("menos")) cambiarCantidad(id, (carritoData.find(i => i.id == id)?.cantidad || 0) - 1);
      if (e.target.classList.contains("eliminarBtn")) eliminarDelCarrito(id);
    });
  });

  // Abrir/cerrar carritos
  if (carritoBtn) carritoBtn.addEventListener("click", e => { e.preventDefault(); mostrarCarrito(false); });
  if (cerrarCarrito) cerrarCarrito.addEventListener("click", () => cerrarCarritoFunc(false));
  if (carrito) carrito.addEventListener("click", e => { if (e.target === carrito) cerrarCarritoFunc(false); });

  if (carritoBtnMobile) carritoBtnMobile.addEventListener("click", e => { e.preventDefault(); mostrarCarrito(true); });
  if (cerrarCarritoMobile) cerrarCarritoMobile.addEventListener("click", () => cerrarCarritoFunc(true));
  if (carritoMobile) carritoMobile.addEventListener("click", e => { if (e.target === carritoMobile) cerrarCarritoFunc(true); });

  // Inicializar contador
  actualizarContadores();

  // Comprar disco desde productos
  document.body.addEventListener("click", e => {
    const btn = e.target.closest(".comprar");
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    const disco = window.discos?.find(d => d.id == id);
    if (!disco || disco.stock <= 0) return;

    const precioFinal = disco.descuento_activo
      ? disco.precio * (1 - disco.descuento / 100)
      : disco.precio;

    const itemExistente = carritoData.find(item => item.id == id);
    if (itemExistente) {
      if (itemExistente.cantidad < disco.stock) itemExistente.cantidad++;
    } else {
      carritoData.push({
        id: disco.id,
        titulo: disco.titulo,
        artista: disco.artista,
        precio: precioFinal,
        precioOriginal: disco.precio,
        descuento: disco.descuento,
        descuento_activo: disco.descuento_activo,
        img: disco.img,
        slug: disco.slug,
        cantidad: 1
      });
    }

    guardarCarrito();
    actualizarContadores();
    actualizarSubtotal();

    // Refrescar carrito abierto
    if (carrito.style.display === "flex") mostrarCarrito(false);
    if (carritoMobile.classList.contains("carrito-mobile-activo")) mostrarCarrito(true);

    // Mensaje flotante
    const mensaje = document.getElementById("mensajeFlotante");
    if (mensaje) {
      mensaje.textContent = `"${disco.titulo}" se agregó al carrito!`;
      mensaje.classList.add("visible");
      setTimeout(() => mensaje.classList.remove("visible"), 2000);
    }
  });
});
