// Constantes
const mensajeExito = document.getElementById("exito");
const form = document.querySelector(".form-contact");
const contenedorErrores = document.getElementById("errores");

// Función para validar un campo individual
function validarCampo(name, value) {
    switch (name) {
        case "email":
            return !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? "El correo ingresado no es válido." : null;
        case "asunto":
            return value.trim().length < 10 ? "El asunto debe tener al menos 10 caracteres." : null;
        case "consulta":
            return value.trim().length < 20 ? "La consulta debe tener al menos 20 caracteres." : null;
        default:
            return null;
    }
}

// Validaciones al enviar
form.addEventListener("submit", e => {
    e.preventDefault();

    const email = form.email.value.trim();
    const asunto = form.asunto.value.trim();
    const consulta = form.consulta.value.trim();

    let errores = [];

    if (validarCampo("email", email)) {
        errores.push({ campo: "email", mensaje: validarCampo("email", email) });
    }
    if (validarCampo("asunto", asunto)) {
        errores.push({ campo: "asunto", mensaje: validarCampo("asunto", asunto) });
    }
    if (validarCampo("consulta", consulta)) {
        errores.push({ campo: "consulta", mensaje: validarCampo("consulta", consulta) });
    }

    if (errores.length > 0) {
        contenedorErrores.innerHTML = `<p class="titulo-errores">Detalle de los errores:</p>` +
            errores.map(e => `<p class="error" data-campo="${e.campo}">${e.mensaje}</p>`).join("");
        return;
    }

    mensajeExito.classList.remove("visible");
    mensajeExito.classList.add("visible");

    setTimeout(() => {
        mensajeExito.classList.remove("visible");
        form.reset();
        contenedorErrores.innerHTML = "";
    }, 2000);
});

// Validación en tiempo real
form.addEventListener("input", e => {
    const campo = e.target.name;
    const valor = e.target.value;
    const errorElemento = contenedorErrores.querySelector(`.error[data-campo="${campo}"]`);
    const errorMensaje = validarCampo(campo, valor);

    if (!errorMensaje && errorElemento) {
        errorElemento.remove();
    }

    if (contenedorErrores.querySelectorAll(".error").length === 0) {
        contenedorErrores.innerHTML = "";
    }
});
