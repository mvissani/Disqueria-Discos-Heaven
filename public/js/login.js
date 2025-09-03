document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const erroresDiv = document.getElementById("errores");
  const mensajeExito = document.getElementById("mensajeExito");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    erroresDiv.innerHTML = "";
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

      // Guardar token y datos de usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario_id", data.id); 
      localStorage.setItem("nombreUsuario", data.nombre);
      localStorage.setItem("rolUsuario", data.rol);

      mensajeExito.style.display = "block";
      mensajeExito.textContent = `¡Bienvenido ${data.nombre}!`;

      window.location.href = "/"; 
    } catch (err) {
      console.error(err);
      erroresDiv.textContent = "Error al iniciar sesión. Intente nuevamente.";
    }
  });
});
