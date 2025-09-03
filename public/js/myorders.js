document.addEventListener("DOMContentLoaded", () => {
  let carritoData = JSON.parse(localStorage.getItem("carrito")) || [];

  const carrito = document.getElementById("carrito");
  const carritoItems = document.getElementById("carritoItems");
  const subtotalCarrito = document.getElementById("subtotalCarrito");
  const contador = document.getElementById("carritoContador");

  // Funciones auxiliares
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carritoData));
  }

  function actualizarContadores() {
    const total = carritoData.reduce((acc, item) => acc + item.cantidad, 0);
    contador.style.display = total > 0 ? "inline-block" : "none";
    contador.textContent = total;
  }

  function actualizarSubtotal() {
    const subtotal = carritoData.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    subtotalCarrito.innerHTML = `<p>Subtotal: $${subtotal.toLocaleString("es-AR")}</p>`;
  }

  function crearItemCarrito(item) {
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = `
      <p>${item.titulo} - ${item.artista}</p>
      <p>Cantidad: ${item.cantidad}</p>
      <p>Precio: $${item.precio.toLocaleString("es-AR")}</p>
    `;
    return div;
  }

  // Mostrar carrito
  function mostrarCarrito() {
    carritoItems.innerHTML = "";
    if (carritoData.length === 0) {
      carritoItems.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
      carritoData.forEach(item => carritoItems.appendChild(crearItemCarrito(item)));

      // Botón pagar
      const btnPagar = document.createElement("button");
      btnPagar.textContent = "Proceder al Pago";
      btnPagar.addEventListener("click", finalizarCompra);
      carritoItems.appendChild(btnPagar);
    }
    actualizarSubtotal();
    carrito.style.display = "flex";
  }

  // Finalizar compra (API)
  function finalizarCompra() {
    if (carritoData.length === 0) return;

    const token = localStorage.getItem("token"); 
    if (!token) {
      alert("Debes iniciar sesión para finalizar la compra.");
      return;
    }

    fetch("/api/myorders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ items: carritoData })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("¡Compra realizada con éxito!");

        // Vaciar carrito
        carritoData = [];
        guardarCarrito();
        actualizarContadores();
        actualizarSubtotal();
        mostrarCarrito();

        // Actualizar historial
        cargarHistorial();
      } else {
        console.error(data);
        alert("Error al realizar la compra.");
      }
    })
    .catch(err => {
      console.error("Error en fetch:", err);
      alert("Ocurrió un error al finalizar la compra.");
    });
  }

  // Historial de compras (API)
  function cargarHistorial() {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/myorders/me", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(compras => {
      const contenedor = document.getElementById("historialCompras");
      contenedor.innerHTML = "";

      if (!Array.isArray(compras) || compras.length === 0) {
        contenedor.innerHTML = "<p>No realizaste compras aún.</p>";
        return;
      }

      compras.forEach((compra, index) => {
        const div = document.createElement("div");
        div.classList.add("compra");

        // Total de dinero
        const total = compra.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
        // Total de unidades
        const totalUnidades = compra.items.reduce((acc, i) => acc + i.cantidad, 0);

        div.innerHTML = `
          <div class="compra-card">
            <h3>Compra #${index + 1} - ${new Date(compra.fecha).toLocaleString("es-AR", { dateStyle: 'short', timeStyle: 'short' })}</h3>
            <p>Total: $${total.toLocaleString("es-AR")} - Unidades: ${totalUnidades}</p>
            <ul>
              ${compra.items.map(i => {
                const precioNum = Number(i.precio); 
                return `<li>${i.titulo} - ${i.artista} [x${i.cantidad}] ($${precioNum.toLocaleString("es-AR")})</li>`;
              }).join("")}
            </ul>
          </div>
        `;
        contenedor.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error al cargar historial:", err);
    });
  }

  // Eventos
  document.getElementById("carritoBtn").addEventListener("click", mostrarCarrito);
  document.getElementById("cerrarCarrito").addEventListener("click", () => carrito.style.display = "none");

  // Inicializar
  actualizarContadores();
  cargarHistorial();
});
