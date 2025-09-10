document.addEventListener("DOMContentLoaded", () => {
  const carreteWrapper = document.querySelector(".carrete-wrapper");
  const carrete = document.getElementById("carrete");
  const btnIzq = document.getElementById("izquierda");
  const btnDer = document.getElementById("derecha");

  if (!carreteWrapper || !carrete || !btnIzq || !btnDer) return;

  let velocidad = 1;
  let isHover = false;
  let isClicking = false;

  function crearCarrete(discs) {
    carrete.innerHTML = "";
    discs.forEach(disco => {
      const div = document.createElement("div");
      div.className = "disco";
      div.innerHTML = `
        <img src="${disco.img}" alt="${disco.titulo}">
        <div class="disco-info">
          <a href="/cd/${disco.slug}">
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

    // Duplicar para loop infinito
    carrete.innerHTML += carrete.innerHTML;
  }

  function autoScroll() {
    if (!isHover && !isClicking) {
      carreteWrapper.scrollLeft += velocidad;
      if (carreteWrapper.scrollLeft >= carrete.scrollWidth / 2) {
        carreteWrapper.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  }

  function moverDisco(direccion) {
    const discosElems = document.querySelectorAll(".disco");
    if (!discosElems.length) return;

    const wrapperCenter = carreteWrapper.scrollLeft + carreteWrapper.offsetWidth / 2;
    let targetDisco;

    if (direccion === "izq") {
      for (let i = discosElems.length - 1; i >= 0; i--) {
        const discoCenter = discosElems[i].offsetLeft + discosElems[i].offsetWidth / 2;
        if (discoCenter < wrapperCenter) {
          targetDisco = discosElems[i];
          break;
        }
      }
      if (!targetDisco) targetDisco = discosElems[discosElems.length - 1];
    } else {
      for (let i = 0; i < discosElems.length; i++) {
        const discoCenter = discosElems[i].offsetLeft + discosElems[i].offsetWidth / 2;
        if (discoCenter > wrapperCenter) {
          targetDisco = discosElems[i];
          break;
        }
      }
      if (!targetDisco) targetDisco = discosElems[0];
    }

    isClicking = true;
    carreteWrapper.scrollTo({
      left: targetDisco.offsetLeft - (carreteWrapper.offsetWidth / 2 - targetDisco.offsetWidth / 2),
      behavior: "smooth"
    });
    setTimeout(() => isClicking = false, 1000);
  }

  // Hover pausa auto-scroll
  carreteWrapper.addEventListener("mouseenter", () => isHover = true);
  carreteWrapper.addEventListener("mouseleave", () => isHover = false);

  // Flechas
  btnIzq.addEventListener("click", () => moverDisco("izq"));
  btnDer.addEventListener("click", () => moverDisco("der"));

  // --- Agregar al carrito ---
  carrete.addEventListener("click", e => {
    const btn = e.target.closest(".comprar");
    if (!btn) return;
    const id = btn.dataset.id;
    if (!id) return;
    const disco = window.discos?.find(d => d.id == id);
    if (!disco) return;

    // Disparamos evento que cart.js escuchará
    document.dispatchEvent(new CustomEvent("agregarAlCarrito", { detail: { disco } }));
  });

  // Inicializar carrete cuando los discos estén listos
  if (Array.isArray(window.discos) && window.discos.length) {
    crearCarrete(window.discos);
    requestAnimationFrame(autoScroll);
  } else {
    window.addEventListener("discosListos", e => {
      crearCarrete(e.detail || []);
      requestAnimationFrame(autoScroll);
    });
  }
});
