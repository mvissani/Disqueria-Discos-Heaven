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

      const data = await res.json(); 
      if (!res.ok) {
        erroresDiv.textContent = data.msg || "Error al iniciar sesión";
        return;
      }

      console.log("Login recibido:", data);

      // Guardar en sessionStorage
      sessionStorage.setItem("token", data.token || "");
      sessionStorage.setItem("usuario", JSON.stringify(data.usuario || {}));
      sessionStorage.setItem("usuario_id", data.usuario?.id || "");
      sessionStorage.setItem("nombreUsuario", data.usuario?.nombre || "");
      sessionStorage.setItem("rolUsuario", data.usuario?.rol || "");
      sessionStorage.setItem("usuarioEmail", data.usuario?.email || "");

      // Confirmación del correo
      console.log("Email del usuario desde sessionStorage:", sessionStorage.getItem("usuarioEmail"));

      if (sessionStorage.getItem("usuarioEmail")) {
        mensajeExito.style.display = "block";
        mensajeExito.textContent = `¡Bienvenido ${data.usuario.nombre || ""}!`;
        setTimeout(() => window.location.href = "/", 800); 
      } else {
        erroresDiv.textContent = "No se pudo guardar la sesión. Intente nuevamente.";
      }

    } catch (err) {
      console.error(err);
      erroresDiv.textContent = "Error al iniciar sesión. Intente nuevamente.";
    }
  });
});
