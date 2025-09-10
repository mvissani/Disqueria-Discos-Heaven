document.addEventListener("DOMContentLoaded", () => {
  const mensaje = document.getElementById("mensajeExito");
  const form = document.getElementById("form-config");

  if (!form) return;

  // Obtener token del usuario
  const token = sessionStorage.getItem("token");
  if (!token) {
    if (mensaje) {
      mensaje.style.display = "block";
      mensaje.style.color = "red";
      mensaje.textContent = "Debes iniciar sesión para ver tus datos.";
    }
    Array.from(form.elements).forEach(el => el.disabled = true);
    return;
  }

  // Traer datos del usuario logueado
  async function cargarUsuario() {
    try {
      const res = await fetch("/users/me", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Usuario no encontrado");
      const user = await res.json();

      document.getElementById("usuarioId").value = user.id || "";
      document.getElementById("nombre").value = user.nombre || "";
      document.getElementById("apellido").value = user.apellido || "";
      document.getElementById("email").value = user.email || "";

    } catch (err) {
      console.error("Error al cargar usuario:", err);
      if (mensaje) {
        mensaje.style.display = "block";
        mensaje.style.color = "red";
        mensaje.textContent = "Error al cargar datos del usuario.";
      }
      Array.from(form.elements).forEach(el => el.disabled = true);
    }
  }

  cargarUsuario();

  // Enviar formulario de actualización
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("usuarioId").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const newpassword = document.getElementById("newpassword").value;

    try {
      const res = await fetch("/users/me", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, nombre, apellido, email, password, newpassword })
      });

      const data = await res.json();

      if (mensaje) {
        mensaje.style.display = "block";
        if (data.msg === "Usuario actualizado correctamente") {
          mensaje.style.color = "green";
          mensaje.textContent = "¡Actualización exitosa!";
          document.getElementById("password").value = "";
          document.getElementById("newpassword").value = "";
        } else {
          mensaje.style.color = "red";
          mensaje.textContent = data.msg || "Error al actualizar usuario.";
        }
      }

    } catch (err) {
      console.error("Error en actualización:", err);
      if (mensaje) {
        mensaje.style.display = "block";
        mensaje.style.color = "red";
        mensaje.textContent = "Error al actualizar usuario.";
      }
    }
  });
});
