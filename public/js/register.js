const form = document.getElementById("registro-form");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const email = document.getElementById("email");
const password = document.getElementById("password");

const errorNombre = document.getElementById("errorNombre");
const errorApellido = document.getElementById("errorApellido");
const errorEmail = document.getElementById("errorEmail");
const errorPassword = document.getElementById("errorPassword");
const mensajeExito = document.getElementById("mensajeExito");

const inputs = document.querySelectorAll("#registro-form input");
const cdContainer = document.querySelector(".cd-container");

// Limpiar errores
function limpiarErrores() {
    [errorNombre, errorApellido, errorEmail, errorPassword].forEach(el => el.classList.remove("visible"));
    mensajeExito.classList.remove("visible");
}

form.addEventListener("submit", async e => {
    e.preventDefault();
    limpiarErrores();

    let valido = true;

    if (nombre.value.trim().length < 3) {
        errorNombre.classList.add("visible");
        valido = false;
    }
    if (apellido.value.trim().length < 3) {
        errorApellido.classList.add("visible");
        valido = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        errorEmail.classList.add("visible");
        valido = false;
    }
    if (password.value.length < 6) {
        errorPassword.classList.add("visible");
        valido = false;
    }

    if (!valido) return;

    // Intentamos registrar en el backend
    try {
        const res = await fetch("/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: nombre.value.trim(),
                apellido: apellido.value.trim(),
                email: email.value.trim(),
                password: password.value
            })
        });

        const text = await res.text();

        if (!res.ok) {
            // Mostramos error del backend según el mensaje
            if (text.toLowerCase().includes("email")) errorEmail.classList.add("visible");
            else mensajeExito.textContent = text; // error general
            return;
        }

        mensajeExito.classList.add("visible");
        mensajeExito.textContent = text;
        cdContainer.classList.add("completed");

        setTimeout(() => {
            mensajeExito.classList.remove("visible");
            form.reset();
            cdContainer.classList.remove("completed");
        }, 2000);

    } catch (err) {
        console.error(err);
        mensajeExito.classList.add("visible");
        mensajeExito.textContent = "Ocurrió un error al registrar. Intenta nuevamente.";
    }
});

// Animación según campos
function checkForm() {
    let allFilled = true;
    inputs.forEach(input => {
        if (input.value.trim() === "") allFilled = false;
    });

    if (allFilled) cdContainer.classList.add("completed");
    else cdContainer.classList.remove("completed");
}

inputs.forEach(input => input.addEventListener("input", checkForm));
