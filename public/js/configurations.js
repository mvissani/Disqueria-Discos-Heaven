// Configuraciones de usuario
document.addEventListener("DOMContentLoaded", () => {
  const mensaje = document.getElementById("mensajeExito");
  const form = document.getElementById("form-config");

  // Evitar errores si no hay formulario en la página
  if (!form) return;

  // Obtener email del usuario desde sessionStorage
  const emailUsuario = sessionStorage.getItem("usuarioEmail");
  console.log("Email del usuario desde sessionStorage:", emailUsuario);

  // Si no hay usuario logueado
  if (!emailUsuario) {
    if (mensaje) {
      mensaje.style.display = "block";
      mensaje.style.color = "red";
      mensaje.textContent = "No hay usuario logueado. Inicie sesión primero.";
    }
    // Deshabilitar inputs y botón
    Array.from(form.elements).forEach(el => el.disabled = true);
    return;
  }

  // Traer datos del usuario desde backend
  fetch(`/users/me?email=${encodeURIComponent(emailUsuario)}`)
    .then(res => {
      if (!res.ok) throw new Error("Usuario no encontrado");
      return res.json();
    })
    .then(user => {
      if (!user) {
        if (mensaje) {
          mensaje.style.display = "block";
          mensaje.style.color = "red";
          mensaje.textContent = "Usuario no encontrado";
        }
        return;
      }
      document.getElementById("usuarioId").value = user.id || "";
      document.getElementById("nombre").value = user.nombre || "";
      document.getElementById("apellido").value = user.apellido || "";
      document.getElementById("email").value = user.email || "";
    })
    .catch(err => {
      console.error("Error al cargar usuario:", err);
      if (mensaje) {
        mensaje.style.display = "block";
        mensaje.style.color = "red";
        mensaje.textContent = "Error al cargar datos del usuario.";
      }
    });

  // Submit para actualizar datos
  form.addEventListener("submit", e => {
    e.preventDefault();

    const id = document.getElementById("usuarioId").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const newpassword = document.getElementById("newpassword").value;

    fetch("/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, nombre, apellido, email, password, newpassword })
    })
      .then(res => res.json().catch(() => ({ msg: "Error inesperado" })))
      .then(data => {
        console.log("Respuesta actualización usuario:", data);
        if (mensaje) {
          mensaje.style.display = "block";
          if (data.msg === "Usuario actualizado correctamente") {
            mensaje.style.color = "green";
            mensaje.textContent = "¡Actualización Exitosa!";
            document.getElementById("password").value = "";
            document.getElementById("newpassword").value = "";
          } else {
            mensaje.style.color = "red";
            mensaje.textContent = data.msg || "Error al actualizar usuario.";
          }
        }
      })
      .catch(err => {
        console.error("Error en actualización:", err);
        if (mensaje) {
          mensaje.style.display = "block";
          mensaje.style.color = "red";
          mensaje.textContent = "Error al actualizar usuario.";
        }
      });
  });
});
