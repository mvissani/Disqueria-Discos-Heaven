// ------------------- Variables Globales -------------------
window.discos = window.discos || [];
window.carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

// ------------------- Fetch de discos -------------------
fetch("/api/products")
  .then(res => res.json())
  .then(data => {
    window.discos = data.discos || data;
    inicializarDiscos();
    inicializarArtistas();
  })
  .catch(err => console.error("Error al obtener discos:", err));

// ------------------- Carrusel de Discos -------------------
function inicializarDiscos() {
  const carreteWrapper = document.querySelector(".carrete-wrapper");
  const carrete = document.getElementById("carrete");
  const btnIzq = document.getElementById("izquierda");
  const btnDer = document.getElementById("derecha");
  if (!carreteWrapper || !carrete || !btnIzq || !btnDer) return;

  let velocidad = 1, isHover = false, isClicking = false;

  function crearCarrete(discs) {
    carrete.innerHTML = "";
    discs.forEach(disco => {
      const div = document.createElement("div");
      div.className = "disco";
      div.innerHTML = `
        <img src="${disco.img}" alt="${disco.titulo}">
        <div class="disco-info">
          <a href="/products/${disco.slug}">
            <strong>${disco.titulo}</strong><br>
            <em>${disco.artista}</em>
          </a>
          <button class="comprar" data-id="${disco.id}">
            <i class="fa-solid fa-cart-plus"></i>
          </button>
        </div>
      `;
      carrete.appendChild(div);

      div.addEventListener("mouseenter", () => div.classList.add("activo"));
      div.addEventListener("mouseleave", () => div.classList.remove("activo"));
    });

    // Loop infinito
    carrete.innerHTML += carrete.innerHTML;
  }

  function autoScroll() {
    if (!isHover && !isClicking) {
      carreteWrapper.scrollLeft += velocidad;
      if (carreteWrapper.scrollLeft >= carrete.scrollWidth / 2) carreteWrapper.scrollLeft = 0;
    }
    requestAnimationFrame(autoScroll);
  }

  function mover(direccion) {
    const elems = document.querySelectorAll("#carrete .disco");
    if (!elems.length) return;

    const wrapperCenter = carreteWrapper.scrollLeft + carreteWrapper.offsetWidth / 2;
    let target;

    if (direccion === "izq") {
      for (let i = elems.length - 1; i >= 0; i--) {
        const center = elems[i].offsetLeft + elems[i].offsetWidth / 2;
        if (center < wrapperCenter) { target = elems[i]; break; }
      }
      if (!target) target = elems[elems.length - 1];
    } else {
      for (let i = 0; i < elems.length; i++) {
        const center = elems[i].offsetLeft + elems[i].offsetWidth / 2;
        if (center > wrapperCenter) { target = elems[i]; break; }
      }
      if (!target) target = elems[0];
    }

    isClicking = true;
    carreteWrapper.scrollTo({
      left: target.offsetLeft - (carreteWrapper.offsetWidth / 2 - target.offsetWidth / 2),
      behavior: "smooth"
    });
    setTimeout(() => isClicking = false, 1000);
  }

  carreteWrapper.addEventListener("mouseenter", () => isHover = true);
  carreteWrapper.addEventListener("mouseleave", () => isHover = false);
  btnIzq.addEventListener("click", () => mover("izq"));
  btnDer.addEventListener("click", () => mover("der"));

  // Agregar al carrito
  carrete.addEventListener("click", e => {
    const btn = e.target.closest(".comprar");
    if (!btn) return;
    const id = btn.dataset.id;
    const disco = window.discos.find(d => d.id == id);
    if (!disco) return;

    document.dispatchEvent(new CustomEvent("agregarAlCarrito", { detail: { disco } }));
  });

  crearCarrete(window.discos);
  requestAnimationFrame(autoScroll);
}

// ------------------- Carrusel de Artistas -------------------
function inicializarArtistas() {
  const carreteWrapper = document.querySelector("#carrete-artistas").parentElement;
  const carrete = document.getElementById("carrete-artistas");
  const btnIzq = document.getElementById("izquierda-artistas");
  const btnDer = document.getElementById("derecha-artistas");
  if (!carreteWrapper || !carrete || !btnIzq || !btnDer) return;

  let velocidad = 1, isHover = false, isClicking = false;

  const artistasVistos = new Set();
  const artistas = [];
  window.discos.forEach(disco => {
    if (!artistasVistos.has(disco.artista)) {
      artistasVistos.add(disco.artista);
      artistas.push({
        nombre: disco.artista,
        img: disco.img_artista,
        slug: disco.slug_art || generarSlug(disco.artista)
      });
    }
  });
  artistas.sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));

  function crearCarreteArtistas() {
    carrete.innerHTML = "";
    artistas.forEach(artista => {
      const div = document.createElement("div");
      div.className = "disco"; 
      div.innerHTML = `
        <img src="${artista.img}" alt="${artista.nombre}">
        <a href="/artists/${artista.slug}">
          <div class="disco-info"><strong>${artista.nombre}</strong></div>
        </a>
      `;
      carrete.appendChild(div);

      div.addEventListener("mouseenter", () => isHover = true);
      div.addEventListener("mouseleave", () => isHover = false);

      div.addEventListener("click", () => {
        window.location.href = `/artists/${artista.slug}`;
      });
    });

    carrete.innerHTML += carrete.innerHTML;
  }

  function autoScroll() {
    if (!isHover && !isClicking) {
      carreteWrapper.scrollLeft += velocidad;
      if (carreteWrapper.scrollLeft >= carrete.scrollWidth / 2) carreteWrapper.scrollLeft = 0;
    }
    requestAnimationFrame(autoScroll);
  }

  function mover(direccion) {
    const elems = document.querySelectorAll("#carrete-artistas .disco");
    if (!elems.length) return;

    const wrapperCenter = carreteWrapper.scrollLeft + carreteWrapper.offsetWidth / 2;
    let target;

    if (direccion === "izq") {
      for (let i = elems.length - 1; i >= 0; i--) {
        const center = elems[i].offsetLeft + elems[i].offsetWidth / 2;
        if (center < wrapperCenter) { target = elems[i]; break; }
      }
      if (!target) target = elems[elems.length - 1];
    } else {
      for (let i = 0; i < elems.length; i++) {
        const center = elems[i].offsetLeft + elems[i].offsetWidth / 2;
        if (center > wrapperCenter) { target = elems[i]; break; }
      }
      if (!target) target = elems[0];
    }

    isClicking = true;
    carreteWrapper.scrollTo({
      left: target.offsetLeft - (carreteWrapper.offsetWidth / 2 - target.offsetWidth / 2),
      behavior: "smooth"
    });
    setTimeout(() => isClicking = false, 1000);
  }

  carreteWrapper.addEventListener("mouseenter", () => isHover = true);
  carreteWrapper.addEventListener("mouseleave", () => isHover = false);
  btnIzq.addEventListener("click", () => mover("izq"));
  btnDer.addEventListener("click", () => mover("der"));

  crearCarreteArtistas();
  requestAnimationFrame(autoScroll);
}

// ------------------- Evento global para agregar al carrito -------------------
document.addEventListener("agregarAlCarrito", e => {
  const disco = e.detail.disco;
  const itemExistente = window.carrito.find(i => i.id === disco.id);
  if (itemExistente) itemExistente.cantidad++;
  else window.carrito.push({ ...disco, cantidad: 1 });
  sessionStorage.setItem("carrito", JSON.stringify(window.carrito));

  const mensaje = document.getElementById("mensajeFlotante");
  if (mensaje) {
    mensaje.textContent = `"${disco.titulo}" se agregó al carrito!`;
    mensaje.classList.add("visible");
    setTimeout(() => mensaje.classList.remove("visible"), 2000);
  }
});
