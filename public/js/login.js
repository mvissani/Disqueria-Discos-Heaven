document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return; 

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const erroresDiv = document.getElementById("errores");
  const mensajeExito = document.getElementById("mensajeExito");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    erroresDiv.textContent = "";
    mensajeExito.style.display = "none";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      erroresDiv.textContent = "Todos los campos son obligatorios.";
      return;
    }

    try {
      const res = await fetch("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const textoRespuesta = await res.text();
      if (!res.ok) {
        erroresDiv.textContent = textoRespuesta;
        return;
      }

      const data = JSON.parse(textoRespuesta);

      console.log("Login recibido:", data); 

      // Guardar correctamente en sessionStorage
      sessionStorage.setItem("token", data.token || "");
      sessionStorage.setItem("usuario_id", data.id !== undefined ? data.id : "");
      sessionStorage.setItem("nombreUsuario", data.nombre || "");
      sessionStorage.setItem("rolUsuario", data.rol || "");
      sessionStorage.setItem("usuarioEmail", data.email || ""); 

      // Confirmamos que se guardó antes de redirigir
      console.log("Email del usuario desde sessionStorage:", sessionStorage.getItem("usuarioEmail"));

      if (sessionStorage.getItem("usuarioEmail")) {
        mensajeExito.style.display = "block";
        mensajeExito.textContent = `¡Bienvenido ${data.nombre || ""}!`;
        // Redirigir al home
        window.location.href = "/";
      } else {
        erroresDiv.textContent = "No se pudo guardar la sesión. Intente nuevamente.";
      }

    } catch (err) {
      console.error(err);
      erroresDiv.textContent = "Error al iniciar sesión. Intente nuevamente.";
    }
  });
});
