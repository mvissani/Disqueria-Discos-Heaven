window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Si no hay token, redirige al login
    window.location.href = "/log-in";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/admin-panel", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const contenido = document.getElementById("contenido");

    if (res.ok) {
      const data = await res.text(); // o res.json() según tu backend
      contenido.textContent = data;
    } else {
      // Token inválido o expirado
      localStorage.removeItem("token");
      window.location.href = "/log-in";
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor");
  }
});

// Botón de logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/log-in";
});
